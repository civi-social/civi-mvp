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

    if (!location) {
      globalState.noSavedFeed = false;
    } else {
      savedPreferences = createFilterParams({
        location,
        level,
        tags,
        dontShowSponsoredByReps,
      });
    }

    // Global State
    const lastVisited = getCookieFromString(cookieHeader, "lastVisited");
    globalState.lastVisited = lastVisited || "";
  }

  // Explore State is in the URL Search Params
  const url = new URL(request.url);

  globalState.showExplore = url.searchParams.get("showExplore") === "true";

  let searchParams: FilterParams | null = null;
  if (globalState.showExplore) {
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
    globalState.showExplore && searchParams
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

  const showExplore = result.globalState.showExplore;

  useEffect(() => {
    // Delete search params if not on explore
    if (!result.globalState.showExplore) {
      setSearchParams(new URLSearchParams());
    }
  }, []);

  const updateFilters: UpdateFiltersFn = ({
    location,
    tags,
    level,
    dontShowSponsoredByReps,
  }) => {
    // Decide which storage to use
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const cookies = useCookies(document);
    const storage = showExplore ? newSearchParams : cookies;

    // Update Filters
    location
      ? storage.set("location", getLocation(location))
      : storage.delete("location");

    hasTags(tags)
      ? storage.set("tags", stringifyTags(tags))
      : storage.delete("tags");

    level ? storage.set("level", level) : storage.delete("level");

    dontShowSponsoredByReps
      ? newSearchParams.set("dontShowSponsoredByReps", "true")
      : newSearchParams.delete("dontShowSponsoredByReps");

    if (storage instanceof URLSearchParams) {
      setSearchParams(storage);
    } else {
      setGlobalState({ ...globalState, noSavedFeed: false });
    }
  };

  const updateGlobalState: UpdateGlobalStateFn = (next) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if ("showExplore" in next) {
      next.showExplore
        ? newSearchParams.set("showExplore", "true")
        : newSearchParams.delete("showExplore");
    }
    if ("lastVisited" in next) {
      const cookies = useCookies(document);
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
    />
  );
}
