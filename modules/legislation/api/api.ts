import type { Env } from "~/config";
import type { Locales } from "~/levels";
import { RepLevel } from "~/levels";

import type { CiviLegislationData } from "civi-legislation-data";
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

export const getLegislations = async (
  env: Env,
  levels: RepLevel,
  locale: Locales | null
): Promise<CiviLegislationData[]> => {
  console.log("getting bills for", locale, levels);
  let legislation: CiviLegislationData[] = [];
  switch (locale) {
    case "Chicago":
      switch (levels) {
        case RepLevel.City:
          legislation = await getCachedLegislationData("chicago");
          break;
        case RepLevel.State:
          legislation = await getCachedLegislationData("illinois");
          break;
        case RepLevel.National:
          legislation = await getCachedLegislationData("usa");
          break;
        default:
          break;
      }
      break;
    default:
      legislation = [];
      break;
  }
  return legislation;
};
