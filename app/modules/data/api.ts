import { Env } from "~app/modules/config";
import {
  FilterParams,
  FeedData,
  SupportedLocale,
  isAddressFilter,
  getLegislations,
  DataStores,
  createFeedBillsFromMultipleSources,
  RepLevel,
  filterNoisyCityBills,
  selectBillsFromFilters,
  sortByUpdatedAt,
  getAddress,
  SPONSORED_BY_REP_TAG,
  hasSponsoredByRepTag,
} from "./legislation";
import { getRepresentatives } from "./representatives/api";

export const getFilteredLegislation = async ({
  env,
  filters,
}: {
  env: Env;
  filters: FilterParams;
}): Promise<FeedData> => {
  // Must set location to get data
  if (!filters.location) {
    return {
      fullLegislation: [],
      filteredLegislation: [],
      offices: null,
    };
  }
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

  const { representatives, offices } = await getRepsAndOffices(
    env,
    filters.location
  );

  const showSponsoredBills = Boolean(
    representatives && hasSponsoredByRepTag(filters.tags)
  );

  // First select all bills that are sponsored, if the user wants sponsored bills
  const fullLegislation = createFeedBillsFromMultipleSources(representatives, [
    [
      allChicagoBills,
      RepLevel.City,
      [filterNoisyCityBills(showSponsoredBills)],
    ],
    [allILBills, RepLevel.State, null],
    [allUSBills, RepLevel.National, null],
  ]);

  // Then select and filter bills based on user filters
  let filteredLegislation = selectBillsFromFilters(fullLegislation, filters);

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
