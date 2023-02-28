import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import type { Env } from "~/config";
import { getEnv } from "~/config";
import type { FilterParams, ForYouBill, UpdateFiltersFn } from "~/for-you";
import { ForYou, forYouData } from "~/for-you";
import type { RepLevel } from "~/levels";

interface LoaderData {
  legislation: ForYouBill[];
  tags: string[];
  env: Env;
  filters: FilterParams;
}
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const filters: FilterParams = {
    tags: url.searchParams.get("tags")?.split(","),
    address: url.searchParams.get("address"),
    level: url.searchParams.get("level") as RepLevel,
  };

  const env = getEnv(process.env);

  const { legislation, tags } = await forYouData({ env, filters });

  return json<LoaderData>({ legislation, env, tags, filters });
};

interface ActionData {
  errors?: {};
}

export const action: ActionFunction = async ({ request }) => {
  return json<ActionData>({}, { status: 200 });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return {
    title: "Chicago Civi",
  };
};

export default function ForYouPage() {
  const { legislation, tags, filters } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilters: UpdateFiltersFn = ({ address, tags, level }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    address
      ? newSearchParams.set("address", address)
      : newSearchParams.delete("address");

    tags && Array.isArray(tags) && tags.length > 0
      ? newSearchParams.set("tags", tags.join(","))
      : newSearchParams.delete("tags");
    level
      ? newSearchParams.set("level", level)
      : newSearchParams.delete("level");
    setSearchParams(newSearchParams);
  };

  return (
    <ForYou
      tags={tags}
      legislation={legislation}
      filters={filters}
      updateFilters={updateFilters}
    />
  );
}
