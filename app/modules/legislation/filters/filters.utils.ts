import { AVAILABLE_TAGS, RepLevel, SupportedLocale } from "./filters.constants";
import {
  LocationFilter,
  type Locales,
  Nullish,
  AddressFilter,
} from "./filters.types";

export const getLocale = (
  formattedAddress: string | Nullish
): null | Locales => {
  return formattedAddress && /Chicago, IL/gi.test(formattedAddress)
    ? "Chicago"
    : null;
};

export const getAddress = <T extends unknown>(
  location: T
): string | Nullish => {
  if (isAddressFilter(location)) {
    return location.address;
  }
  return null;
};

export const isAddressFilter = (
  location: unknown
): location is AddressFilter => {
  if (
    typeof location === "object" &&
    location !== null &&
    "address" in location &&
    typeof location.address === "string"
  ) {
    return true;
  }
  return false;
};

export const isNullish = (location: unknown | Nullish): location is Nullish => {
  return [null, "", undefined].includes(location as any);
};

export const isSupportedLocale = (
  locationParam: unknown
): locationParam is SupportedLocale => {
  if (isAddressFilter(locationParam)) {
    return false;
  }
  if (isNullish(locationParam)) {
    return false;
  }
  return Object.values(SupportedLocale).includes(locationParam as any);
};

export const getLocation = (
  location: string | AddressFilter | Nullish
): string => {
  return isAddressFilter(location)
    ? location.address
    : location || DEFAULT_LOCALE;
};

export const createLocationFilterFromString = (
  locationParam: unknown
): LocationFilter =>
  isNullish(locationParam)
    ? DEFAULT_LOCALE
    : isSupportedLocale(locationParam)
    ? locationParam
    : typeof locationParam === "string" && locationParam.length > 0
    ? ({ address: locationParam } as AddressFilter)
    : DEFAULT_LOCALE;

export const isNotCustomLocation = (location: LocationFilter): boolean =>
  isSupportedLocale(location) && location !== SupportedLocale.Custom;

export const DEFAULT_LOCALE = SupportedLocale.USA;

export const isCityLevel = (location: LocationFilter): boolean =>
  isAddressFilter(location) || location === SupportedLocale.Chicago;

export const isStateLevel = (location: LocationFilter): boolean =>
  !isAddressFilter(location) && location === SupportedLocale.Illinois;

export const hasTags = (tags: unknown): tags is string[] => {
  return Boolean(tags && Array.isArray(tags) && tags.length > 0);
};
export const stringifyTags = (tags: string[]) => {
  return tags.join(",");
};

export const parseTagsString = (
  tags: string | null | undefined
): string[] | null => {
  const parsed = tags?.split(",").filter((tag) => tag.length > 0);
  return hasTags(parsed) ? parsed : null;
};

export const DEFAULT_FILTERS: FilterParams = {
  location: DEFAULT_LOCALE,
  level: null,
  tags: null,
  availableTags: AVAILABLE_TAGS,
  dontShowSponsoredByReps: null,
};

export const parseRepLevel = (level?: string | null): RepLevel | null => {
  return !level ? null : (level as RepLevel);
};

export interface FilterParams {
  location: LocationFilter;
  dontShowSponsoredByReps: true | null;
  tags: string[] | null;
  availableTags: string[];
  level: RepLevel | null;
}

export const parseDontShowSponsoredByReps = (v: unknown): true | null => {
  return (typeof v === "string" && v === "true") || null;
};

export const createFilterParams = (p: {
  location: string | Nullish;
  level: string | Nullish;
  tags: string | Nullish;
  dontShowSponsoredByReps: string | Nullish;
}) => {
  return {
    location: createLocationFilterFromString(p.location),
    level: parseRepLevel(p.level),
    tags: parseTagsString(p.tags),
    dontShowSponsoredByReps: parseDontShowSponsoredByReps(
      p.dontShowSponsoredByReps
    ),
    availableTags: AVAILABLE_TAGS,
  };
};
