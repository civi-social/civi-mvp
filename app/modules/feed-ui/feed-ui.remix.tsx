import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getEnv } from "~app/modules/config";

import { useEffect, useState } from "react";
import { Feed } from "~app/modules/feed-ui";
import type { FilterParams } from "~app/modules/data/legislation/filters";
import {
  DEFAULT_FILTERS,
  createFilterParams,
  getLocation,
  hasTags,
  parseRepLevel,
  stringifyTags,
} from "~app/modules/data/legislation/filters";
import { getFilteredLegislation } from "../data/legislation/api";
import type {
  FeedLoaderData,
  FeedProps,
  GlobalState,
  UpdateFiltersFn,
  UpdateGlobalStateFn,
} from "./feed-ui.types";
import {
  formatDate,
  getCookieFromString,
  cookieFactory,
} from "./feed-ui.utils";

export const loader: LoaderFunction = async ({ request }) => {
  const globalState: GlobalState = {
    lastVisited: "",
    noSavedFeed: true,
    showExplore: false,
  };

  // Feed State is in Cookies
  const cookieHeader = request.headers.get("Cookie");
  let savedPreferences: FilterParams | null = null;
  if (!cookieHeader) {
    savedPreferences = DEFAULT_FILTERS;
  } else {
    const location = getCookieFromString(cookieHeader, "location");
    const level = getCookieFromString(cookieHeader, "level");
    const tags = getCookieFromString(cookieHeader, "tags");
    const dontShowSponsoredByReps = getCookieFromString(
      cookieHeader,
      "dontShowSponsoredByReps"
    );

    if (location) {
      savedPreferences = createFilterParams({
        location,
        level,
        tags,
        dontShowSponsoredByReps,
      });
      globalState.noSavedFeed = false;
    }

    // Global State
    // We have a temp hold state that we leverage for actual rendering, while
    // the long running cookie lastVisited can be used to check actual history.
    const lastVisitHold = getCookieFromString(cookieHeader, "lastVisitHold");
    const lastVisited = getCookieFromString(cookieHeader, "lastVisited");
    globalState.lastVisited = lastVisitHold || lastVisited || "";
  }

  // Explore State is in the URL Search Params
  const url = new URL(request.url);

  globalState.showExplore = url.searchParams.get("showExplore") === "true";

  const levelSearchParam = url.searchParams.get("level");

  const shouldShowExplore = globalState.noSavedFeed || globalState.showExplore;

  let searchParams: FilterParams | null = null;
  if (shouldShowExplore) {
    const tags = url.searchParams.get("tags");
    const location = url.searchParams.get("location");
    const level = levelSearchParam;
    const dontShowSponsoredByReps = url.searchParams.get(
      "dontShowSponsoredByReps"
    );
    searchParams = createFilterParams({
      location,
      level,
      tags,
      dontShowSponsoredByReps,
    });
  }

  // The one search param used on the feed is level
  if (savedPreferences && levelSearchParam) {
    savedPreferences = {
      ...savedPreferences,
      level: parseRepLevel(levelSearchParam),
    };
  }

  // Picking filters based on if feed or explore
  const filters: FilterParams =
    shouldShowExplore && searchParams
      ? searchParams
      : savedPreferences
      ? savedPreferences
      : DEFAULT_FILTERS;

  const env = getEnv(process.env);

  const filteredLegislation = await getFilteredLegislation({
    env,
    filters,
  });

  return json<FeedLoaderData>({
    env,
    filters,
    globalState,
    ...filteredLegislation,
  });
};

interface ActionData {
  errors?: {};
}

export const action: ActionFunction = async ({ request }) => {
  return json<ActionData>({}, { status: 200 });
};

export default function ForYouPage() {
  const result = useLoaderData<FeedProps>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [globalState, setGlobalState] = useState(result.globalState);
  const [filters, setFilters] = useState(result.filters);

  // Update the last updated timestamp
  useEffect(() => {
    const cookies = cookieFactory(document);
    const today = formatDate();
    const previousDate = cookies.get("lastVisited");
    const holdDate = cookies.get("lastVisitedHold");
    if (previousDate !== today) {
      cookies.set("lastVisitHold", previousDate, 0.5);
      cookies.set("lastVisited", today);
      setGlobalState({ ...globalState, lastVisited: previousDate });
    }
    // If hold date exists, use it for global state
    if (holdDate) {
      setGlobalState({ ...globalState, lastVisited: holdDate });
    }
    // Only want this to run once
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const updateFilters: UpdateFiltersFn = (next) => {
    // Decide which storage to use
    const storage = new URLSearchParams(searchParams.toString());
    // Update Filters
    if ("location" in next) {
      location
        ? storage.set("location", getLocation(next.location))
        : storage.delete("location");
    }

    if ("tags" in next) {
      hasTags(next.tags)
        ? storage.set("tags", stringifyTags(next.tags))
        : storage.delete("tags");
    }

    if ("level" in next) {
      next.level ? storage.set("level", next.level) : storage.delete("level");
    }

    if ("dontShowSponsoredByReps" in next) {
      next.dontShowSponsoredByReps
        ? storage.set("dontShowSponsoredByReps", "true")
        : storage.delete("dontShowSponsoredByReps");
    }
    setFilters({ ...filters, ...next });
    setSearchParams(storage);
  };

  const saveToFeed = () => {
    const cookies = cookieFactory(document);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    ["location", "tags", "level", "dontShowSponsoredByReps"].forEach(
      (filterParam) => {
        const savedParam = newSearchParams.get(filterParam);
        if (savedParam) {
          cookies.set(filterParam, savedParam);
        } else {
          cookies.delete(filterParam);
        }
      }
    );
  };

  const updateGlobalState: UpdateGlobalStateFn = (next) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const cookies = cookieFactory(document);
    if ("showExplore" in next) {
      // Get default filter data from your feed
      if (next.showExplore) {
        newSearchParams.set("showExplore", "true");
      } else {
        newSearchParams.delete("showExplore");
      }

      // Go through the filters and add/remove them based on the mode
      ["location", "tags", "level", "dontShowSponsoredByReps"].forEach(
        (filterParam) => {
          if (next.showExplore) {
            const savedParam = cookies.get(filterParam);
            if (savedParam) {
              newSearchParams.set(filterParam, savedParam);
            }
          } else {
            newSearchParams.delete(filterParam);
          }
        }
      );
    }

    setSearchParams(newSearchParams);
    setGlobalState({ ...globalState, ...next });
  };

  return (
    <Feed
      {...result}
      filters={filters}
      globalState={globalState}
      updateGlobalState={updateGlobalState}
      updateFilters={updateFilters}
      saveToFeed={saveToFeed}
    />
  );
}
