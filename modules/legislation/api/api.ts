import type { Env } from "~/config";
import type { Locales } from "~/levels";
import { RepLevel } from "~/levels";

import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import { civiLegislationApi } from "civi-legislation-data";
import { legislationCache } from "./legislation-cache";
import axios from "axios";

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
