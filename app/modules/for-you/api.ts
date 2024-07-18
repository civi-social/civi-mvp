import type { Env } from "~/config";
import { getLegislations } from "~/legislation/api";
import { Locales, RepLevel, SupportedLocale, getAddress } from "~/levels";
import type { OfficialOffice } from "~/representatives";
import { getRepresentatives } from "~/representatives/api";
import type { ForYouBill } from "./selector";
import { selectData } from "./selector";
import { hasOverlap } from "./utils";
import { FilterParams, ForYouData } from "./foryou.types";

export const forYouData = async ({
  env,
  filters,
}: {
  env: Env;
  filters: FilterParams;
}): Promise<ForYouData> => {
  const address = getAddress(filters.location);
  const representatives = address
    ? await getRepresentatives(address, env)
    : null;

  const city =
    filters.location === "Chicago"
      ? selectData(
          await getLegislations(env, RepLevel.City, "Chicago"),
          RepLevel.City,
          representatives
        )
      : [];

  const state =
    filters.location === "Chicago" || filters.location === "Illinois"
      ? selectData(
          await getLegislations(env, RepLevel.State, "Chicago"),
          RepLevel.State,
          representatives
        )
      : [];

  const national = selectData(
    await getLegislations(env, RepLevel.National, "Chicago"),
    RepLevel.National,
    representatives
  );

  const fullLegislation = [...city, ...state, ...national];

  let legislation: typeof fullLegislation = fullLegislation;

  if (filters.level) {
    legislation = fullLegislation.filter(
      (bill) => bill.level === filters.level
    );
  }

  if (filters.tags && Array.isArray(filters.tags)) {
    const filterTags = filters.tags;
    legislation = legislation.filter((bill) =>
      hasOverlap(bill.gpt?.gpt_tags || [], filterTags)
    );
  }

  const tagsWithResults = new Set<string>(["City Ordinance"]);
  legislation.forEach((bill) => {
    bill.gpt?.gpt_tags?.forEach((tag) => {
      tagsWithResults.add(tag);
    });
  });

  // Sort by updated_at
  legislation = legislation.sort((a, b) => {
    const aUpdated = a.bill.updated_at || a.bill.statusDate;
    const bUpdated = b.bill.updated_at || b.bill.statusDate;
    return Date.parse(bUpdated) - Date.parse(aUpdated);
  });

  const offices = representatives
    ? [
        ...representatives.offices.city,
        ...representatives.offices.county,
        ...representatives.offices.state,
        ...representatives.offices.national,
      ]
    : null;

  const location = filters.location;

  return {
    legislation,
    availableTags: AVAILABLE_TAGS,
    tagsWithResults: Array.from(tagsWithResults),
    offices,
    location,
  };
};

const AVAILABLE_TAGS = [
  "Education",
  "Democracy",
  "Health Care",
  "Public Safety",
  "Transit",
  "Abortion",
  "Immigration",
  "Foreign Policy",
  "States Rights",
  "Civil Rights",
  "Climate Change",
  "City Ordinances",
  "Other",
];
