import type { Env } from "~/config";
import type { CiviLegislationData } from "civi-legislation-data";
import { getLegislations } from "~/legislation/api";
import { RepLevel } from "~/levels";

export const forYouData = async (env: Env): Promise<CiviLegislationData[]> => {
  const city: CiviLegislationData[] = await getLegislations(
    env,
    RepLevel.City,
    "Chicago"
  );
  const state: CiviLegislationData[] = await getLegislations(
    env,
    RepLevel.State,
    "Chicago"
  );

  const national: CiviLegislationData[] = await getLegislations(
    env,
    RepLevel.National,
    "Chicago"
  );

  const legislation = [...city, ...state, ...national];

  return legislation;
};
