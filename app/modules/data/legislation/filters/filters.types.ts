// todo: put this file directly in civi-legislation-data

import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import type { RepLevel, SupportedLocale } from "./filters.constants";

export type Locales = `${SupportedLocale}`;

export type LocationFilter = SupportedLocale | AddressFilter | Nullish;

export type AddressFilter = { address: string };

export type Nullish = undefined | "" | null;

type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

export type ForYouBill = {
  bill: CiviLegislationData;
  gpt?: CiviGptData;
  coded_tags: string[];
  allTags: string[];
  level: RepLevel;
  sponsoredByRep?: string | false;
};

export type LegislationResult = {
  legislation: CiviLegislationData[];
  gpt: CiviGptLegislationData;
};

export interface FilterParams {
  location: LocationFilter;
  dontShowSponsoredByReps: true | null;
  tags: string[] | null;
  availableTags: string[];
  level: RepLevel | null;
}
