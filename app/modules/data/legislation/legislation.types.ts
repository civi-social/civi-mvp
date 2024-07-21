import {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import { RepLevel } from "./filters/filters.constants";

type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

export type FeedBill = {
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
