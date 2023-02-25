import type { Env } from "~/config";
import type { CiviLegislationData } from "civi-legislation-data";
import { getLegislations } from "~/legislation/api";
import { RepLevel } from "~/levels";

export const forYouData = async (env: Env): Promise<CiviLegislationData[]> => {
  const { legislation: city } = await getLegislations(
    env,
    RepLevel.City,
    "Chicago"
  );
  const { legislation: state } = await getLegislations(
    env,
    RepLevel.State,
    "Chicago"
  );

  const { legislation: national } = await getLegislations(
    env,
    RepLevel.National,
    "Chicago"
  );

  const legislation = [...city, ...state, ...national];

  return legislation;
};
