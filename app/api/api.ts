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
  let legislation: LegislationData[] = [];
  switch (locale) {
    case "Chicago":
      legislation = await councilmatic.getChicagoBills();
      break;
    case "Illinois":
      legislation = await legiscan.getIllinoisBills(env);
    default:
      legislation = [];
      break;
  }
  return legislation;
};

export const getRepresentatives = google.getRepresentatives;

export const getChicagoWard = google.getChicagoWard;
