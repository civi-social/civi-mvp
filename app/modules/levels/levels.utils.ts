import type { Locales } from "./levels.types";

export const getLocale = (formattedAddress: string | null): null | Locales => {
  return formattedAddress && /Chicago, IL/gi.test(formattedAddress)
    ? "Chicago"
    : null;
};
