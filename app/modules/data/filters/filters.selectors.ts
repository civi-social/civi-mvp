import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import type { RepresentativesResult } from "~app/modules/data/representatives";
import type { FilterParams, WindyCiviBill } from "../legislation";
import {
  ALLOWED_GPT_TAGS,
  CustomTags,
  RepLevel,
  findOverlap,
  findStringOverlap,
  getBillUpdateAt,
  hasTags,
  tagsOverLap,
} from "../legislation";
import { LegislationResult } from "../legislation/legislation.types";

// Start Rep Filters
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

// End Rep Filters

// Start Chicago Filters

const filterOnlyResolutions = (bill: CiviLegislationData) => {
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

export const filterNoisyCityBills =
  (shouldKeepOrdinances: boolean) => (bill: WindyCiviBill) => {
    // Filter out city ordinance and noisy bills if we don't have city representatives data
    if (shouldKeepOrdinances) {
      return true;
    } else {
      return filterOnlyResolutions(bill.bill);
    }
  };

// End Chicago Filters

// Start Default Filters

export const filterBillsOlderThanSixMonths = (bill: WindyCiviBill) => {
  const updated = (bill.bill.updated_at =
    bill.bill.updated_at || bill.bill.statusDate);
  if (!updated) {
    return false;
  }
  return !isDateOlderThanSixMonths(updated);
};

// Generated from GPT
const isDateOlderThanSixMonths = (dateString: string) => {
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
};

// Mainly just filtering by state bills for now.
const DEFAULT_FILTERS = [filterBillsOlderThanSixMonths];

export const sortByUpdatedAt = (bills: WindyCiviBill[]) => {
  return bills.sort((a, b) => {
    const aUpdated = getBillUpdateAt(a);
    const bUpdated = getBillUpdateAt(b);
    return Date.parse(bUpdated) - Date.parse(aUpdated);
  });
};

// End Default Filters

// Start Main Filter Functions

const createFeedBill =
  (
    gpt: CiviGptLegislationData,
    representatives: RepresentativesResult | null,
    level: RepLevel
  ) =>
  (bill: CiviLegislationData): WindyCiviBill => {
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
      bill.classification === "ordinance"
        ? [CustomTags.Ordinance]
        : bill.classification === "resolution"
        ? [CustomTags.Resolution]
        : [];

    const allTags = [...(cleanedGpt?.gpt_tags || []), ...coded_tags];

    return {
      bill,
      gpt: cleanedGpt,
      coded_tags,
      allTags,
      level,
      sponsoredByRep,
    } as WindyCiviBill;
  };

type FeedBillArrayFilter = (bill: WindyCiviBill) => boolean;

export const createFeedBillsFromMultipleSources = (
  representatives: RepresentativesResult | null,
  dataStores: [
    LegislationResult | null | false,
    RepLevel,
    FeedBillArrayFilter[] | null
  ][]
) => {
  let allBills = [] as WindyCiviBill[];
  dataStores.forEach(([legislationResult, repLevel, extraFilters]) => {
    let localeBills = [] as WindyCiviBill[];
    if (!legislationResult) {
      return [] as WindyCiviBill[];
    }
    // Create the for you bill structure
    localeBills = legislationResult.legislation.map(
      createFeedBill(legislationResult.gpt, representatives, repLevel)
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

export const selectBillsFromFilters = (
  bills: WindyCiviBill[],
  filters: FilterParams,
  reps: RepresentativesResult | null
) => {
  const shouldIncludeSponsored = reps && !filters.dontShowSponsoredByReps;
  const shouldIncludesTags = hasTags(filters.tags);

  let filteredLegislation: typeof bills = [];

  // Stuff to add
  bills.forEach((bill) => {
    // If no filters are selected, show all bills
    if (!shouldIncludeSponsored && !shouldIncludesTags) {
      filteredLegislation.push(bill);
    } else if (shouldIncludeSponsored && bill.sponsoredByRep) {
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

// End Main Filter Functions
