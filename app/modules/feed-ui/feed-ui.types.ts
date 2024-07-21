import type { Env } from "../config";
import type { FilterParams } from "../data/legislation";
import { FeedData } from "../data/api/api.types";

export interface FeedLoaderData extends FeedData {
  env: Env;
  filters: FilterParams;
  globalState: GlobalState;
}

export interface FeedProps extends FeedLoaderData {
  updateFilters: UpdateFiltersFn;
  updateGlobalState: UpdateGlobalStateFn;
  saveToFeed: () => void;
}

export interface GlobalState {
  showExplore: boolean;
  lastVisited: string; // timestamp
  noSavedFeed: boolean;
}

export type UpdateFiltersFn = (p: Partial<FilterParams>) => void;

export type UpdateGlobalStateFn = (p: Partial<GlobalState>) => void;

export type FeedFilterProps = FeedProps & {
  showAllReps?: () => void;
};
