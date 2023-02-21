export interface LegislationData {
  status: string;
  date: string;
  id: string;
  title: string;
  link: string;
  tags: string[];
  description?: string;
  sponsor?: string;
}

export type Locales = "Chicago";

export const getLocale = (formattedAddress: string | null): null | Locales => {
  return formattedAddress && /Chicago, IL/gi.test(formattedAddress)
    ? "Chicago"
    : null;
};
