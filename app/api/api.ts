import type { Env } from "~/config";
import type { LegislationData, Locales } from "~/entities/legislation";
import { councilmatic } from "./councilmatic";
import { google } from "./google";
import { legiscan } from "./legiscan";

export const getLegislations = async (
  locale: Locales | null,
  env: Env
): Promise<LegislationData[]> => {
  console.log("getting bills for", locale);
  let bills: LegislationData[] = [];
  switch (locale) {
    case "Chicago":
      bills = await councilmatic.getChicagoBills();
      break;
    case "Illinois":
      bills = await legiscan.getIllinoisBills(env);
    default:
      bills = [];
      break;
  }
  return bills;
};

export const getRepresentatives = google.getRepresentatives;

export const getWard = google.getWard;
