import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import type { RepresentativesResult } from "~/representatives";
import {
  ALLOWED_GPT_TAGS,
  FilterParams,
  ForYouBill,
  LegislationResult,
  Nullish,
  RepLevel,
  findOverlap,
  findStringOverlap,
  hasOverlap,
  hasTags,
} from "..";

export const createForYouBill =
  (
    gpt: CiviGptLegislationData,
    representatives: RepresentativesResult | null,
    level: RepLevel
  ) =>
  (bill: CiviLegislationData): ForYouBill => {
    const gptSummaries = gpt[bill.id];
    // todo: move to civi-legislation-data
    let gptTags = gptSummaries.gpt_tags;
    let overlapped = findStringOverlap(gptTags || [], ALLOWED_GPT_TAGS);

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
    const sponsoredByRep = getUserRepNameIfBillIsSponsored(
      representatives,
      bill.sponsors,
      level
    );
    const coded_tags =
      bill.classification === "ordinance" ? ["City Ordinance"] : [];

    const allTags = [...(cleanedGpt?.gpt_tags || []), ...coded_tags];

    return {
      bill,
      gpt: cleanedGpt,
      coded_tags,
      allTags,
      level,
      sponsoredByRep,
    } as ForYouBill;
  };

export const filterNoisyCityBills =
  (representatives: RepresentativesResult | null) => (bill: ForYouBill) => {
    // Filter out city ordinance and noisy bills if we don't have city representatives data
    if (!representatives) {
      return filterCityBills(bill.bill);
    }
    return true;
  };

export const filterBillsOlderThanSixMonths = (bill: ForYouBill) => {
  const updated = (bill.bill.updated_at =
    bill.bill.updated_at || bill.bill.statusDate);
  if (!updated) {
    return false;
  }
  return !isDateOlderThanSixMonths(updated);
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

const getUserRepNameIfBillIsSponsored = (
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

export const selectBillsFromFilters = (
  bills: ForYouBill[],
  filters: FilterParams,
  reps: RepresentativesResult | null
) => {
  const shouldGetSponsoredBills = reps && !filters.dontShowSponsoredByReps;

  let filteredLegislation: typeof bills = [];

  // Stuff to add
  bills.forEach((bill) => {
    if (shouldGetSponsoredBills && bill.sponsoredByRep) {
      filteredLegislation.push(bill);
    } else if (tagsOverLap(bill.allTags, filters.tags)) {
      filteredLegislation.push(bill);
    }
  });

  // Stuff to take out
  if (filters.level) {
    filteredLegislation = filteredLegislation.filter(
      (bill) => bill.level === filters.level
    );
  }

  return filteredLegislation;
};

const tagsOverLap = (tagList1: unknown, tagList2: unknown) => {
  return (
    hasTags(tagList1) && hasTags(tagList2) && hasOverlap(tagList1, tagList2)
  );
};

export const sortByUpdatedAt = (bills: ForYouBill[]) => {
  return bills.sort((a, b) => {
    const aUpdated = a.bill.updated_at || a.bill.statusDate;
    const bUpdated = b.bill.updated_at || b.bill.statusDate;
    return Date.parse(bUpdated) - Date.parse(aUpdated);
  });
};

type ForYouBillArrayFilter = (bill: ForYouBill) => boolean;

export const createForYouBillsFromMultipleSources = (
  representatives: RepresentativesResult | null,
  dataStores: [
    LegislationResult | null | false,
    RepLevel,
    ForYouBillArrayFilter[] | null
  ][]
) => {
  let allBills = [] as ForYouBill[];
  dataStores.forEach(([legislationResult, repLevel, extraFilters]) => {
    let localeBills = [] as ForYouBill[];
    if (!legislationResult) {
      return [] as ForYouBill[];
    }
    // Create the for you bill structure
    localeBills = legislationResult.legislation.map(
      createForYouBill(legislationResult.gpt, representatives, repLevel)
    );

    // Filter by default filters
    DEFAULT_FILTERS.forEach((filterFunc) => {
      localeBills = localeBills.filter(filterFunc);
    });

    // Filter any extra filters if they exist
    extraFilters?.forEach((filter) => {
      localeBills = localeBills.filter(filter);
    });

    // Add them too the bill total
    allBills.push(...localeBills);
  });

  // Return all bills
  return allBills;
};

// Mainly just filtering by state bills for now.
const DEFAULT_FILTERS = [filterBillsOlderThanSixMonths];

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

export const filterBySponsoredBills =
  (reps: RepresentativesResult | null, level: RepLevel) =>
  (bill: CiviLegislationData) => {
    if (reps) {
      return Boolean(
        getUserRepNameIfBillIsSponsored(reps, bill.sponsors, level)
      );
    }
    return true;
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
