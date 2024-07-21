import {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import { RepLevel } from "../filters/filters.constants";

export type LegislationResult = {
  legislation: CiviLegislationData[];
  gpt: CiviGptLegislationData;
};

type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

export interface FilteredLegislationData {
  bill: CiviLegislationData;
  gpt?: CiviGptData;
  coded_tags: string[];
  allTags: string[];
  level: RepLevel;
}
