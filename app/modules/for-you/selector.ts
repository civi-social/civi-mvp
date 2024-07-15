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
  return (
    legislation
      .filter((bill) => {
        // Filter out city ordinance and noisy bills if we don't have city representatives data
        if (level === RepLevel.City && !representatives) {
          return filterCityBills(bill);
        }
        return true;
      })
      // only show sponsored bills if filtered by rep
      .filter((bill) => {
        if (representatives) {
          return filterBySponsoredBills(bill, representatives, level);
        }
        return true;
      })
      // Filter by bills updated in the last 6 months
      .filter((bill) => {
        const updated = (bill.updated_at = bill.updated_at || bill.statusDate);
        if (!updated) {
          return false;
        }
        return !isDateOlderThanSixMonths(updated);
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
        const sponsoredByRep = findBillsSponsoredByRep(
          representatives,
          bill.sponsors,
          level
        );
        return {
          bill,
          gpt: cleanedGpt,
          level,
          sponsoredByRep,
        } as ForYouBill;
      })
  );
};

// Generated from GPT
function isDateOlderThanSixMonths(dateString: string) {
  // Parse the input date string into a Date object
  const dateParts = dateString.split("-");
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is zero-based
  const day = parseInt(dateParts[2], 10);
  const inputDate = new Date(year, month, day);

  // Calculate date 6 months ago from now
  const currentDate = new Date();
  const sixMonthsAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 6,
    currentDate.getDate()
  );

  // Compare input date with 6 months ago date
  return inputDate < sixMonthsAgo;
}

const findBillsSponsoredByRep = (
  representatives: RepresentativesResult | null,
  sponsors: CiviLegislationData["sponsors"],
  level: RepLevel
): string | false => {
  if (!representatives) {
    return false;
  }
  // We need to a hack for city level because we don't have the office id data
  // todo: work with DataMade to get the office id data within the person data
  if (level === RepLevel.City) {
    const cityReps = representatives?.offices.city
      .filter((o) => o.office.divisionId.includes("place:chicago"))
      // Chicago Mayor can sponsor bills. Ignore those.
      .filter((o) => o.office.roles.includes("legislatorLowerBody"));

    // We are hacking the name to see if it matches the sponsor name
    // From Bunkum, the name is "Martin, Matthew J." while, the office name may be "Matthew J. Martin"
    const sanitizedSponsors = sponsors.map((s) => sanitizeAndOrderName(s.name));
    const matchedSponsors: string[] = [];
    cityReps.forEach((cityRep) => {
      const sanitizedSponsor = sanitizeAndOrderName(cityRep.official.name);
      if (sanitizedSponsors.includes(sanitizedSponsor)) {
        const sanitizedOfficeName = cityRep.office.name
          .replace("Chicago", "")
          .replace("City", "")
          .trim();
        matchedSponsors.push(sanitizedOfficeName + " " + cityRep.official.name);
      }
    });
    if (matchedSponsors.length > 0) {
      return matchedSponsors.join(", ");
    } else {
      return false;
    }
  }

  // For state and national, we can use the office id data as legiscan provides that data
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

const filterBySponsoredBills = (
  bill: CiviLegislationData,
  reps: RepresentativesResult,
  level: RepLevel
) => {
  return Boolean(findBillsSponsoredByRep(reps, bill.sponsors, level));
};

// hack to find matches in sponsor names
// From Bunkum, the name is "Martin, Matthew J." while, the office name may be "Matthew J. Martin"
const sanitizeAndOrderName = (name: string): string => {
  return (
    name
      .replace(",", "")
      .replace(".", "")
      .split(" ")
      .filter((name) => name.length > 1)
      // sort alphabetically
      .sort()
      .join(" ")
  );
};
