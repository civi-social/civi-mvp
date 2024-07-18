import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getEnv } from "~/config";

import { useEffect, useState } from "react";
import { ForYou } from "~/for-you";
import {
  DEFAULT_FILTERS,
  FilterParams,
  createFilterParams,
  getLocation,
  hasTags,
  stringifyTags,
} from "~app/modules/legislation/filters";
import { getFilteredLegislation } from "../legislation/api";
import {
  ForYouLoaderData,
  ForYouProps,
  GlobalState,
  UpdateFiltersFn,
  UpdateGlobalStateFn,
} from "./foryou.types";
import { getCookieFromString, useCookies } from "./utils";

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
    const lastVisited = getCookieFromString(cookieHeader, "lastVisited");
    globalState.lastVisited = lastVisited || "";
  }

  // Explore State is in the URL Search Params
  const url = new URL(request.url);

  globalState.showExplore = url.searchParams.get("showExplore") === "true";
  const shouldShowExplore = globalState.noSavedFeed || globalState.showExplore;

  let searchParams: FilterParams | null = null;
  if (shouldShowExplore) {
    const tags = url.searchParams.get("tags");
    const location = url.searchParams.get("location");
    const level = url.searchParams.get("level");
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

  // Picking filters based on if feed or explore
  const filters: FilterParams =
    shouldShowExplore && searchParams
      ? searchParams
      : savedPreferences
      ? savedPreferences
      : DEFAULT_FILTERS;

  const env = getEnv(process.env);

  const forYouDataResult = await getFilteredLegislation({
    env,
    filters,
  });

  return json<ForYouLoaderData>({
    env,
    filters,
    globalState,
    ...forYouDataResult,
  });
};

interface ActionData {
  errors?: {};
}

export const action: ActionFunction = async ({ request }) => {
  return json<ActionData>({}, { status: 200 });
};

export const meta: MetaFunction = ({ data }: { data: ForYouProps }) => {
  return {
    title: "Bill Updates - Windy Civi",
    viewport: "width=device-width,initial-scale=1",
    charset: "utf-8",
  };
};

export default function ForYouPage() {
  const result = useLoaderData<ForYouProps>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [globalState, setGlobalState] = useState(result.globalState);

  useEffect(() => {
    // Delete search params if not on explore
    if (!globalState.showExplore && !globalState.noSavedFeed) {
      setSearchParams(new URLSearchParams());
    }
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

    if (storage instanceof URLSearchParams) {
      setSearchParams(storage);
    } else {
      setGlobalState({ ...globalState, noSavedFeed: false });
    }
  };

  const saveToFeed = () => {
    const cookies = useCookies(document);
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
    const cookies = useCookies(document);
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

    if ("lastVisited" in next) {
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${year}-${month}-${day}`;
      cookies.set("lastVisited", currentDate);
    }
    setSearchParams(newSearchParams);
    setGlobalState({ ...globalState, ...next });
  };

  return (
    <ForYou
      {...result}
      globalState={globalState}
      updateGlobalState={updateGlobalState}
      updateFilters={updateFilters}
      saveToFeed={saveToFeed}
    />
  );
}
