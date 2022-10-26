import type { Bill } from "./entities/bills";
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
  bills: Bill[];
};

export type Config = {
  apiKey: string;
};
