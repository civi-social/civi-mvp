import type { Env } from "~/config";
import { getLegislations } from "~/legislation/api";
import { RepLevel } from "~/levels";
import type { OfficialOffice } from "~/representatives";
import { getRepresentatives } from "~/representatives/api";
import type { FilterParams } from "./react/ForYou";
import type { ForYouBill } from "./selector";
import { selectData } from "./selector";
import { hasOverlap } from "./utils";

export const forYouData = async ({
  env,
  filters,
}: {
  env: Env;
  filters: FilterParams;
}): Promise<{
  legislation: ForYouBill[];
  tags: string[];
  offices: OfficialOffice[] | null;
  address: string | null;
}> => {
  const representatives = filters.address
    ? await getRepresentatives(filters.address, env)
    : null;

  const city = selectData(
    await getLegislations(env, RepLevel.City, "Chicago"),
    RepLevel.City,
    representatives
  );

  const state = selectData(
    await getLegislations(env, RepLevel.State, "Chicago"),
    RepLevel.State,
    representatives
  );

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

  const tags = new Set<string>();
  legislation.forEach((bill) => {
    bill.gpt?.gpt_tags?.forEach((tag) => {
      tags.add(tag);
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

  const address = filters.address || null;

  return {
    legislation,
    tags: Array.from(tags),
    offices,
    address,
  };
};
