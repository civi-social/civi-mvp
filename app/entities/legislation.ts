export interface LegislationData {
  status: string;
  date: string;
  sponsor: string;
  id: string;
  title: string;
  link: string;
  tags: string[];
}

export type Locales = "Illinois" | "Chicago";

export const getLocale = (formattedAddress: string | null): null | Locales => {
  return formattedAddress && /Chicago, IL/gi.test(formattedAddress)
    ? "Chicago"
    : null;
};
