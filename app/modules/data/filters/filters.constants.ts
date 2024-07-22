import type { FilterParams } from "./filters.types";

export const ALLOWED_GPT_TAGS = [
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

// City level filters for tags that are not GPT tags
export enum CustomCityTags {
  "Ordinance" = "City Ordinance",
  "Resolution" = "City Resolution",
}

export const AVAILABLE_TAGS = [
  ...Object.values(CustomCityTags),
  ...ALLOWED_GPT_TAGS,
];

export enum RepLevel {
  City = "city",
  County = "county",
  State = "state",
  National = "national",
}

export enum SupportedLocale {
  Chicago = "Chicago",
  Illinois = "Illinois",
  USA = "USA",
}

export enum DataStores {
  Chicago = "Chicago",
  Illinois = "Illinois",
  USA = "USA",
}

export const DEFAULT_LOCALE = SupportedLocale.USA;

export const DEFAULT_FILTERS: FilterParams = {
  location: DEFAULT_LOCALE,
  level: null,
  tags: null,
  availableTags: AVAILABLE_TAGS,
  dontShowSponsoredByReps: null,
};
