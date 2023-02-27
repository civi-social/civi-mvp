import type { Env } from "~/config";
import { getLegislations } from "~/legislation/api";
import { RepLevel } from "~/levels";
import type { ForYouBill } from "./selector";
import { selectData } from "./selector";

export const forYouData = async (
  env: Env
): Promise<{ legislation: ForYouBill[]; tags: string[] }> => {
  const city = selectData(
    await getLegislations(env, RepLevel.City, "Chicago"),
    RepLevel.City
  );

  const state = selectData(
    await getLegislations(env, RepLevel.State, "Chicago"),
    RepLevel.City
  );

  const national = selectData(
    await getLegislations(env, RepLevel.National, "Chicago"),
    RepLevel.City
  );

  const legislation = [...city, ...state, ...national];

  const tags = new Set<string>();

  legislation.forEach((bill) => {
    bill.gpt?.gpt_tags?.forEach((tag) => {
      tags.add(tag);
    });
  });

  return { legislation, tags: Array.from(tags) };
};
