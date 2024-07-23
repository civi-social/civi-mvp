import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getEnv } from "~app/modules/config";

import { useEffect, useState } from "react";
import { Feed } from "~app/modules/feed-ui";
import type { FilterParams } from "~app/modules/data/filters";
import {
  DEFAULT_FILTERS,
  createFilterParams,
  getLocation,
  hasTags,
  parseRepLevel,
  stringifyTags,
} from "~app/modules/data/filters";
import { getFilteredLegislation } from "~app/modules/data/api";
import {
  type FeedLoaderData,
  type FeedProps,
  type GlobalState,
  type UpdateFiltersFn,
  type UpdateGlobalStateFn,
} from "./feed-ui.types";
import {
  formatDate,
  getCookieFromString,
  cookieFactory,
} from "./feed-ui.utils";
import { RouteOption } from "./feed-ui.constants";

export const loader: LoaderFunction = async ({ request }) => {
  const globalState: GlobalState = {
    lastVisited: "",
    route: RouteOption.INTRO,
    hideLLMWarning: false,
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

    if (location) {
      savedPreferences = createFilterParams({
        location,
        level,
        tags,
      });
    }

    // Global State
    // We have a temp hold state that we leverage for actual rendering, while
    // the long running cookie lastVisited can be used to check actual history.
    const lastVisitHold = getCookieFromString(cookieHeader, "lastVisitHold");
    const lastVisited = getCookieFromString(cookieHeader, "lastVisited");
    globalState.lastVisited = lastVisitHold || lastVisited || "";

    const hideLLMWarning = getCookieFromString(cookieHeader, "hideLLMWarning");
    if (hideLLMWarning) {
      globalState.hideLLMWarning = true;
    }
  }

  // Explore State is in the URL Search Params
  const url = new URL(request.url);

  const showExplore = url.searchParams.get("showExplore");

  if (!savedPreferences) {
    globalState.route = RouteOption.INTRO;
  } else if (savedPreferences && showExplore) {
    globalState.route = RouteOption.EXPLORE;
  } else {
    globalState.route = RouteOption.FEED;
  }

  const shouldAcceptSearchParams = globalState.route === RouteOption.EXPLORE;

  const levelSearchParam = url.searchParams.get("level");

  let searchParams: FilterParams | null = null;
  if (shouldAcceptSearchParams) {
    const tags = url.searchParams.get("tags");
    const location = url.searchParams.get("location");
    const level = levelSearchParam;
    searchParams = createFilterParams({
      location,
      level,
      tags,
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
    shouldAcceptSearchParams && searchParams
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
    // Ignore on intro
    if (globalState.route === RouteOption.INTRO) {
      return;
    }
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
      // Always delete level to reset
      storage.delete("level");

      const locationString = getLocation(next.location);
      if (!locationString) {
        storage.delete("location");
      } else {
        storage.set("location", locationString);
      }
    } else if ("level" in next) {
      next.level ? storage.set("level", next.level) : storage.delete("level");
    }

    if ("tags" in next) {
      hasTags(next.tags)
        ? storage.set("tags", stringifyTags(next.tags))
        : storage.delete("tags");
    }

    setFilters({ ...filters, ...next });
    setSearchParams(storage);
  };

  const saveToFeed: FeedProps["saveToFeed"] = (next) => {
    const cookies = cookieFactory(document);
    Object.keys(next).forEach((k) => {
      const key = k as keyof FilterParams;
      let value = next[key] ? String(next[key]) : null;
      if (key === "location") {
        value = getLocation(next[key] as FilterParams["location"]);
      }
      if (value) {
        cookies.set(key, value);
      } else {
        cookies.delete(key);
      }
    });
    setFilters({ ...filters, ...next });
    // Reset URL Search Params
    setSearchParams(new URLSearchParams());
  };

  const updateGlobalState: UpdateGlobalStateFn = (next) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const cookies = cookieFactory(document);
    if ("route" in next) {
      const showExplore = next.route === RouteOption.EXPLORE;
      // Get default filter data from your feed
      if (next.route === RouteOption.EXPLORE) {
        newSearchParams.set("showExplore", "true");
      } else {
        newSearchParams.delete("showExplore");
      }

      // Go through the filters and add/remove them based on the mode
      ["location", "tags", "level"].forEach((filterParam) => {
        if (showExplore) {
          const savedParam = cookies.get(filterParam);
          if (savedParam) {
            newSearchParams.set(filterParam, savedParam);
          }
        } else {
          newSearchParams.delete(filterParam);
        }
      });
    }

    if ("hideLLMWarning" in next) {
      cookies.set("hideLLMWarning", "true");
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
