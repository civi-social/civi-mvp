import { Env } from "../config";
import { FilterParams, LocationFilter } from "../legislation";
import { OfficialOffice } from "../representatives";
import { ForYouBill } from "../legislation/filters";

export interface ForYouLoaderData extends ForYouData {
  env: Env;
  filters: FilterParams;
  globalState: GlobalState;
}

export interface ForYouProps extends ForYouLoaderData {
  updateFilters: UpdateFiltersFn;
  updateGlobalState: UpdateGlobalStateFn;
}

export interface GlobalState {
  showExplore: boolean;
  lastVisited: string; // timestamp
  noSavedFeed: boolean;
}

export type ForYouData = {
  legislation: ForYouBill[];
  offices: OfficialOffice[] | null;
};

export type UpdateFiltersFn = (p: Partial<FilterParams>) => void;

export type UpdateGlobalStateFn = (p: Partial<GlobalState>) => void;

export type FYBFilterProps = ForYouProps & {
  showAllOfficesButton?: React.ReactNode;
};
