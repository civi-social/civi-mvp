import type { Env } from "~/config";

import axios from "axios";
import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import { civiLegislationApi } from "civi-legislation-data";
import { ForYouData } from "~app/modules/for-you/foryou.types";
import { getRepresentatives } from "~app/modules/representatives/api";
import {
  DataStores,
  FilterParams,
  LegislationResult,
  RepLevel,
  SupportedLocale,
  createForYouBillsFromMultipleSources,
  filterNoisyCityBills,
  getAddress,
  isAddressFilter,
  selectBillsFromFilters,
  sortByUpdatedAt,
} from "../filters";
import { legislationCache } from "./legislation-cache";

const getCachedLegislationData = async (
  name: Parameters<typeof civiLegislationApi.getLegislationDataUrl>[0]
): Promise<CiviLegislationData[]> => {
  const cacheKey = `civi-legislation-data:${name}`;

  // return cache if it exists
  if (legislationCache.has(cacheKey)) {
    return legislationCache.get(cacheKey) as CiviLegislationData[];
  }

  const result = await axios.get<CiviLegislationData[]>(
    civiLegislationApi.getLegislationDataUrl(name)
  );

  const legislation = result.data;

  // set cache
  legislationCache.set(cacheKey, legislation);

  return legislation;
};

const getCachedLegislationGptData = async (
  name: Parameters<typeof civiLegislationApi.getLegislationDataUrl>[0]
): Promise<CiviGptLegislationData> => {
  const cacheKey = `civi-legislation-gpt-data:${name}`;

  // return cache if it exists
  if (legislationCache.has(cacheKey)) {
    return legislationCache.get(cacheKey) as CiviGptLegislationData;
  }

  const result = await axios.get<CiviGptLegislationData>(
    civiLegislationApi.getGptLegislationUrl(name)
  );

  const legislation = result.data;

  // set cache
  legislationCache.set(cacheKey, legislation);

  return legislation;
};

export const getLegislations = async (
  locale: DataStores
): Promise<LegislationResult> => {
  console.log("getting bills for", locale);
  let legislation: CiviLegislationData[] = [];
  let gpt: CiviGptLegislationData = {};
  switch (locale) {
    case DataStores.Chicago:
      legislation = await getCachedLegislationData("chicago");
      gpt = await getCachedLegislationGptData("chicago");
      break;
    case DataStores.Illinois:
      legislation = await getCachedLegislationData("illinois");
      gpt = await getCachedLegislationGptData("illinois");
      break;
    case DataStores.USA:
      legislation = await getCachedLegislationData("usa");
      gpt = await getCachedLegislationGptData("usa");
      break;
    default:
      break;
  }
  return { legislation, gpt };
};

export const getFilteredLegislation = async ({
  env,
  filters,
}: {
  env: Env;
  filters: FilterParams;
}): Promise<ForYouData> => {
  const { representatives, offices } = await getRepsAndOffices(
    env,
    filters.location
  );

  // Check which bills to retrieve
  // todo: put this in a generic map to allow for extensibility
  const shouldGetChicago =
    filters.location === SupportedLocale.Chicago ||
    isAddressFilter(filters.location);
  const shouldGetIllinois =
    shouldGetChicago || filters.location === SupportedLocale.Illinois;

  // Get all bills from all the network
  const allChicagoBills =
    shouldGetChicago && (await getLegislations(DataStores.Chicago));
  const allILBills =
    shouldGetIllinois && (await getLegislations(DataStores.Illinois));
  const allUSBills = await getLegislations(DataStores.USA);

  const shouldShowSponsoredOrdinances = Boolean(
    representatives && !filters.dontShowSponsoredByReps
  );

  // First select all bills that are sponsored, if the user wants sponsored bills
  const fullLegislation = createForYouBillsFromMultipleSources(
    representatives,
    [
      [
        allChicagoBills,
        RepLevel.City,
        [filterNoisyCityBills(shouldShowSponsoredOrdinances)],
      ],
      [allILBills, RepLevel.State, null],
      [allUSBills, RepLevel.National, null],
    ]
  );

  // Then select and filter bills based on user filters
  let filteredLegislation = selectBillsFromFilters(
    fullLegislation,
    filters,
    representatives
  );

  // Sort by updated_at
  filteredLegislation = sortByUpdatedAt(filteredLegislation);

  return {
    fullLegislation,
    filteredLegislation,
    offices,
  };
};

const getRepsAndOffices = async (
  env: Env,
  location: FilterParams["location"]
) => {
  // Get representatives
  const address = getAddress(location);
  const representatives = address
    ? await getRepresentatives(address, env)
    : null;

  // Get a list of all representative offices
  const offices = representatives
    ? [
        ...representatives.offices.city,
        ...representatives.offices.county,
        ...representatives.offices.state,
        ...representatives.offices.national,
      ]
    : null;
  return { representatives, offices };
};
