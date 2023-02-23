import type { Env } from "~/config";
import type { Locales } from "~/levels";
import { RepLevel } from "~/levels";
import type { LegislationData } from "../legislation.types";
import { councilmatic } from "./councilmatic";
import { legiscan } from "./legiscan";

export const getLegislations = async (
  env: Env,
  levels: RepLevel,
  locale: Locales | null
): Promise<LegislationData[]> => {
  console.log("getting bills for", locale, levels);
  let legislation: LegislationData[] = [];
  switch (locale) {
    case "Chicago":
      switch (levels) {
        case RepLevel.City:
          legislation = await councilmatic.getChicagoBills();
          break;
        case RepLevel.State:
          legislation = await legiscan.getIllinoisBills(env);
          break;
        case RepLevel.National:
          legislation = await legiscan.getNationalBills(env);
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
