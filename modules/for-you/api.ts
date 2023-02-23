import type { Env } from "~/config";
import type { LegislationData } from "~/legislation";
import { getLegislations } from "~/legislation/api";
import { RepLevel } from "~/levels";

export const forYouData = async (env: Env): Promise<LegislationData[]> => {
  const city: LegislationData[] = await getLegislations(
    env,
    RepLevel.City,
    "Chicago"
  );
  const state: LegislationData[] = await getLegislations(
    env,
    RepLevel.State,
    "Chicago"
  );

  const national: LegislationData[] = await getLegislations(
    env,
    RepLevel.National,
    "Chicago"
  );

  const legislation = [...city, ...state, ...national];

  return legislation;
};
