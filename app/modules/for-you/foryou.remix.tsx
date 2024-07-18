import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getEnv } from "~/config";

import { ForYou, forYouData } from "~/for-you";
import {
  AddressFilter,
  LocationFilter,
  isSupportedLocale,
  type Locales,
  type RepLevel,
  createLocationFilterFromString,
} from "~/levels";
import {
  FilterParams,
  ForYouLoaderData,
  ForYouProps,
  UpdateFiltersFn,
} from "./foryou.types";
import { getCookieFromString } from "./utils";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieAddress = getCookieFromString(cookieHeader || "", "address");

  const savedPreferences: FilterParams = {
    location: { address: cookieAddress },
  };

  const url = new URL(request.url);
  const showExplore = url.searchParams.get("showExplore") === "true";

  const locationParam = url.searchParams.get("location") as Locales | string;
  const locationFilter: LocationFilter =
    createLocationFilterFromString(locationParam);

  const filters: FilterParams = showExplore
    ? {
        tags: url.searchParams.get("tags")?.split(","),
        location: locationFilter,
        level: url.searchParams.get("level") as RepLevel,
        showExplore: url.searchParams.get("showExplore") === "true",
      }
    : savedPreferences;

  const env = getEnv(process.env);

  const { legislation, availableTags, tagsWithResults, offices, location } =
    await forYouData({
      env,
      filters,
    });

  return json<ForYouLoaderData>({
    legislation,
    env,
    availableTags,
    tagsWithResults,
    filters,
    offices,
    location,
    savedPreferences,
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

  const updateFilters: UpdateFiltersFn = ({
    location,
    tags,
    level,
    showExplore,
  }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    location && typeof location === "object"
      ? newSearchParams.set("location", location.address)
      : location
      ? newSearchParams.set("location", location)
      : newSearchParams.delete("location");
    tags && Array.isArray(tags) && tags.length > 0
      ? newSearchParams.set("tags", tags.join(","))
      : newSearchParams.delete("tags");
    level
      ? newSearchParams.set("level", level)
      : newSearchParams.delete("level");
    showExplore
      ? newSearchParams.set("showExplore", "true")
      : newSearchParams.delete("showExplore");
    setSearchParams(newSearchParams);
  };

  return <ForYou {...result} updateFilters={updateFilters} />;
}
