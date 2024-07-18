import type { Env } from "~/config";

import axios from "axios";
import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import { civiLegislationApi } from "civi-legislation-data";
import { ForYouData } from "~app/modules/for-you/foryou.types";
import { hasOverlap } from "~app/modules/for-you/utils";
import { getRepresentatives } from "~app/modules/representatives/api";
import {
  DataStores,
  FilterParams,
  ForYouBill,
  RepLevel,
  createForYouBill,
  filterBillsOlderThanSixMonths,
  filterNoisyCityBills,
  getAddress,
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

type LegislationResult = {
  legislation: CiviLegislationData[];
  gpt: CiviGptLegislationData;
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
  const address = getAddress(filters.location);
  const representatives = address
    ? await getRepresentatives(address, env)
    : null;

  const shouldGetChicago = filters.location === "Chicago";
  const shouldGetIllinois = shouldGetChicago || filters.location === "Illinois";

  const allChicagoBills = shouldGetChicago
    ? await getLegislations(DataStores.Chicago)
    : null;
  const allILBills = shouldGetIllinois
    ? await getLegislations(DataStores.Illinois)
    : null;
  const allUSBills = await getLegislations(DataStores.USA);

  // First select all bills that are sponsored, if the user wants sponsored bills

  let city = [] as ForYouBill[];
  if (allChicagoBills) {
    city = allChicagoBills.legislation
      .filter(filterBillsOlderThanSixMonths)
      .filter(filterNoisyCityBills(representatives, RepLevel.City))
      .map(
        createForYouBill(allChicagoBills.gpt, representatives, RepLevel.City)
      );
  }

  let state = [] as ForYouBill[];
  if (allILBills) {
    state = allILBills.legislation
      .filter(filterBillsOlderThanSixMonths)
      .map(createForYouBill(allILBills.gpt, representatives, RepLevel.State));
  }

  let national = [] as ForYouBill[];
  if (allUSBills) {
    national = allUSBills.legislation
      .filter(filterBillsOlderThanSixMonths)
      .map(
        createForYouBill(allUSBills.gpt, representatives, RepLevel.National)
      );
  }

  const fullLegislation = [...city, ...state, ...national];

  let filteredLegislation: typeof fullLegislation = fullLegislation;

  if (filters.level) {
    filteredLegislation = fullLegislation.filter(
      (bill) => bill.level === filters.level
    );
  }

  if (filters.tags && Array.isArray(filters.tags)) {
    const filterTags = filters.tags;
    filteredLegislation = filteredLegislation.filter((bill) =>
      hasOverlap(bill.gpt?.gpt_tags || [], filterTags)
    );
  }

  // Sort by updated_at
  filteredLegislation = filteredLegislation.sort((a, b) => {
    const aUpdated = a.bill.updated_at || a.bill.statusDate;
    const bUpdated = b.bill.updated_at || b.bill.statusDate;
    return Date.parse(bUpdated) - Date.parse(aUpdated);
  });

  const offices = representatives
    ? [
        ...representatives.offices.city,
        ...representatives.offices.county,
        ...representatives.offices.state,
        ...representatives.offices.national,
      ]
    : null;

  return {
    fullLegislation,
    filteredLegislation,
    offices,
  };
};
