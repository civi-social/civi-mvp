import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import { RepLevel } from "~/levels";
import type { RepresentativesResult } from "~/representatives";
import { findOverlap } from "./utils";

const ALLOWED_TAGS = [
  "Economy",
  "Education",
  "Democracy",
  "Health Care",
  "Public Safety",
  "Transit",
  "Abortion",
  "Immigration",
  "Foreign Policy",
  "States Rights",
  "Civil Rights",
  "Climate Change",
  "Other",
];

// todo: put this type directly in civi-legislation-data
type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

export type ForYouBill = {
  bill: CiviLegislationData;
  gpt?: CiviGptData;
  level: RepLevel;
  sponsoredByRep?: string | false;
};

export const selectData = (
  {
    legislation,
    gpt,
  }: {
    legislation: CiviLegislationData[];
    gpt: CiviGptLegislationData;
  },
  level: RepLevel,
  representatives: RepresentativesResult | null
): ForYouBill[] => {
  return legislation
    .filter((bill) => {
      if (level === RepLevel.City) {
        return filterCityBills(bill);
      }
      return true;
    })
    .map((bill) => {
      const gptSummaries = gpt[bill.id];
      // todo: move to civi-legislation-data
      let gptTags = gptSummaries.gpt_tags;
      let overlapped = findStringOverlap(gptTags || [], ALLOWED_TAGS);

      // remove any extra others if it has other categories
      if (overlapped.length > 1) {
        overlapped = overlapped.filter((str) => str !== "Other");
      }

      // if it has no categories, add other
      if (overlapped.length === 0) {
        overlapped.push("Other");
      }
      const cleanedGpt = {
        gpt_summary: gptSummaries.gpt_summary,
        gpt_tags: overlapped,
      };
      return {
        bill,
        gpt: cleanedGpt,
        level,
        sponsoredByRep: findBillsSponsoredByRep(
          representatives,
          bill.sponsors,
          level
        ),
      } as ForYouBill;
    });
};

const findBillsSponsoredByRep = (
  representatives: RepresentativesResult | null,
  sponsors: CiviLegislationData["sponsors"],
  level: RepLevel
): string | false => {
  const divisions = representatives?.offices[level]?.map(
    (o) => o.office.divisionId
  );
  const sponsoredOffice = findOverlap(
    divisions || [],
    sponsors.map((s) => s.district)
  );
  let sponsoredByRep: string | false = false;
  representatives?.offices[level].forEach((o) => {
    if (o.office.divisionId === sponsoredOffice) {
      sponsoredByRep = o.official.name;
    }
  });
  return sponsoredByRep;
};

const findStringOverlap = (arr1: string[], arr2: string[]) => {
  let overlap = [];

  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        overlap.push(arr1[i]);
      }
    }
  }

  return overlap;
};

// todo: move to civi-legislation-data
const filterCityBills = (bill: CiviLegislationData) => {
  const isCityResolution = bill.classification === "resolution";
  if (!isCityResolution) {
    return false;
  }
  if (bill.tags?.includes("City Council Rules")) {
    return false;
  }
  if (bill.title.toLowerCase().includes("birthday")) {
    return false;
  }
  return true;
};
