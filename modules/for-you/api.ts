import type { Env } from "~/config";
import { getLegislations } from "~/legislation/api";
import { RepLevel } from "~/levels";
import type { FilterParams } from "./react/ForYou";
import type { ForYouBill } from "./selector";
import { selectData } from "./selector";

const hasOverlap = (arr1: string[], arr2: string[]): boolean => {
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      return true;
    }
  }
  return false;
};

export const forYouData = async ({
  env,
  filters,
}: {
  env: Env;
  filters: FilterParams;
}): Promise<{ legislation: ForYouBill[]; tags: string[] }> => {
  const city = selectData(
    await getLegislations(env, RepLevel.City, "Chicago"),
    RepLevel.City
  );

  const state = selectData(
    await getLegislations(env, RepLevel.State, "Chicago"),
    RepLevel.State
  );

  const national = selectData(
    await getLegislations(env, RepLevel.National, "Chicago"),
    RepLevel.National
  );

  const fullLegislation = [...city, ...state, ...national];

  let levelsFiltered: typeof fullLegislation = fullLegislation;

  if (filters.level) {
    levelsFiltered = fullLegislation.filter(
      (bill) => bill.level === filters.level
    );
  }

  let legislation: typeof levelsFiltered = levelsFiltered;

  if (filters.tags && Array.isArray(filters.tags)) {
    const filterTags = filters.tags;
    legislation = fullLegislation.filter((bill) =>
      hasOverlap(bill.gpt?.gpt_tags || [], filterTags)
    );
  }

  const tags = new Set<string>();
  levelsFiltered.forEach((bill) => {
    bill.gpt?.gpt_tags?.forEach((tag) => {
      tags.add(tag);
    });
  });

  return { legislation, tags: Array.from(tags) };
};
