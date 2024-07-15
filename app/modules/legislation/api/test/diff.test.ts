// Meant to be run with ts-node as a place to test data

import type { Locales } from "../../../levels";
import { RepLevel } from "../../../levels";

import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import { civiLegislationApi } from "civi-legislation-data";

import { mockDataCurrent, mockDataPrevious } from "./mocks";

const getCachedLegislationData = async (
  name: Parameters<typeof civiLegislationApi.getLegislationDataUrl>[0],
  previous: boolean
): Promise<CiviLegislationData[]> => {
  const cacheKey = `civi-legislation-data:${name}`;

  if (previous) {
    return mockDataPrevious.get(cacheKey) as CiviLegislationData[];
  }

  return mockDataCurrent.get(cacheKey) as CiviLegislationData[];
};

const getCachedLegislationGptData = async (
  name: Parameters<typeof civiLegislationApi.getLegislationDataUrl>[0]
): Promise<CiviGptLegislationData> => {
  const cacheKey = `civi-legislation-gpt-data:${name}`;

  return mockDataCurrent.get(cacheKey) as CiviGptLegislationData;
};

export const getLegislations = async (
  levels: RepLevel,
  locale: Locales | null,
  previous: boolean
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
          legislation = await getCachedLegislationData("chicago", previous);
          gpt = await getCachedLegislationGptData("chicago");
          break;
        case RepLevel.State:
          legislation = await getCachedLegislationData("illinois", previous);
          gpt = await getCachedLegislationGptData("illinois");
          break;
        case RepLevel.National:
          legislation = await getCachedLegislationData("usa", previous);
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

async function main() {
  const bills = await getLegislations(RepLevel.State, "Chicago", false);
  const localStorageBills = await getLegislations(
    RepLevel.State,
    "Chicago",
    true
  );

  let billsWithChanges = [];

  bills.legislation.map((bill) => {
    const prevBillState = localStorageBills.legislation.find(
      (lsb) => lsb.id === bill.id
    );

    // We have a new bill
    if (!prevBillState) {
      console.log("New Bill       ", bill.id);
    }

    // Check if status of bill has changed
    if (prevBillState?.status !== bill.status) {
      console.log("New Bill Status", bill.id, bill.status);
    }
  });
}

main();
