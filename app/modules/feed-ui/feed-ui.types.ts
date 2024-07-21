import type { Env } from "../config";
import type { FilterParams } from "../data/legislation";
import type { OfficialOffice } from "../data/representatives";
import type { ForYouBill } from "../data/legislation/filters";

export interface ForYouLoaderData extends ForYouData {
  env: Env;
  filters: FilterParams;
  globalState: GlobalState;
}

export interface ForYouProps extends ForYouLoaderData {
  updateFilters: UpdateFiltersFn;
  updateGlobalState: UpdateGlobalStateFn;
  saveToFeed: () => void;
}

export interface GlobalState {
  showExplore: boolean;
  lastVisited: string; // timestamp
  noSavedFeed: boolean;
}

export type ForYouData = {
  fullLegislation: ForYouBill[];
  filteredLegislation: ForYouBill[];
  offices: OfficialOffice[] | null;
};

export type UpdateFiltersFn = (p: Partial<FilterParams>) => void;

export type UpdateGlobalStateFn = (p: Partial<GlobalState>) => void;

export type FYBFilterProps = ForYouProps & {
  showAllReps?: () => void;
};
