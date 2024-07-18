import type { Env } from "~/config";

import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import { civiLegislationApi } from "civi-legislation-data";
import { legislationCache } from "./legislation-cache";
import axios from "axios";
import {
  AVAILABLE_TAGS,
  FilterParams,
  Locales,
  RepLevel,
  getAddress,
  selectData,
} from "../filters";
import { ForYouData } from "~app/modules/for-you/foryou.types";
import { getRepresentatives } from "~app/modules/representatives/api";
import { hasOverlap } from "~app/modules/for-you/utils";

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
  env: Env,
  levels: RepLevel,
  locale: Locales | null
): Promise<{
  legislation: CiviLegislationData[];
  gpt: CiviGptLegislationData;
}> => {
  console.log("getting bills for", locale, levels);
  let legislation: CiviLegislationData[] = [];
  let gpt: CiviGptLegislationData = {};
  switch (locale) {
    case "Chicago":
      switch (levels) {
        case RepLevel.City:
          legislation = await getCachedLegislationData("chicago");
          gpt = await getCachedLegislationGptData("chicago");
          break;
        case RepLevel.State:
          legislation = await getCachedLegislationData("illinois");
          gpt = await getCachedLegislationGptData("illinois");
          break;
        case RepLevel.National:
          legislation = await getCachedLegislationData("usa");
          gpt = await getCachedLegislationGptData("usa");
          break;
        default:
          break;
      }
      break;
    default:
      legislation = [];
      gpt = {};
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

  const city =
    filters.location === "Chicago"
      ? selectData(
          await getLegislations(env, RepLevel.City, "Chicago"),
          RepLevel.City,
          representatives
        )
      : [];

  const state =
    filters.location === "Chicago" || filters.location === "Illinois"
      ? selectData(
          await getLegislations(env, RepLevel.State, "Chicago"),
          RepLevel.State,
          representatives
        )
      : [];

  const national = selectData(
    await getLegislations(env, RepLevel.National, "Chicago"),
    RepLevel.National,
    representatives
  );

  const fullLegislation = [...city, ...state, ...national];

  let legislation: typeof fullLegislation = fullLegislation;

  if (filters.level) {
    legislation = fullLegislation.filter(
      (bill) => bill.level === filters.level
    );
  }

  if (filters.tags && Array.isArray(filters.tags)) {
    const filterTags = filters.tags;
    legislation = legislation.filter((bill) =>
      hasOverlap(bill.gpt?.gpt_tags || [], filterTags)
    );
  }

  const tagsWithResults = new Set<string>(["City Ordinance"]);
  legislation.forEach((bill) => {
    bill.gpt?.gpt_tags?.forEach((tag) => {
      tagsWithResults.add(tag);
    });
  });

  // Sort by updated_at
  legislation = legislation.sort((a, b) => {
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

  const location = filters.location;

  return {
    legislation,
    availableTags: AVAILABLE_TAGS,
    tagsWithResults: Array.from(tagsWithResults),
    offices,
    location,
  };
};
