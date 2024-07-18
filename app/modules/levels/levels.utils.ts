import {
  LocationFilter,
  SupportedLocale,
  type Locales,
  Nullish,
  AddressFilter,
} from "./levels.types";

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

export const isDefaultLocale = (location: LocationFilter): boolean =>
  isSupportedLocale(location) && location !== SupportedLocale.Custom;

const DEFAULT_LOCALE = SupportedLocale.USA;
