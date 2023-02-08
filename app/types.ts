import type { LegislationData } from "./entities/legislation";
import type { RepresentativesResult } from "./entities/representatives";

export enum RepLevel {
  City = "city",
  County = "county",
  State = "state",
  National = "national",
}

export type AppData = {
  apiKey: string;
  representatives: RepresentativesResult | null;
  bills: LegislationData[];
};

export type Config = {
  apiKey: string;
};
