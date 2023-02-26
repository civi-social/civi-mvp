import type { Env } from "~/config";
import { getLegislations } from "~/legislation/api";
import { RepLevel } from "~/levels";
import type { CiviLegislationDataWithGpt } from "./legislation-with-gpt";
import { mapGptDataToLegislation } from "./legislation-with-gpt";

export const forYouData = async (
  env: Env
): Promise<CiviLegislationDataWithGpt[]> => {
  const city = mapGptDataToLegislation(
    await getLegislations(env, RepLevel.City, "Chicago")
  );

  const state = mapGptDataToLegislation(
    await getLegislations(env, RepLevel.State, "Chicago")
  );

  const national = mapGptDataToLegislation(
    await getLegislations(env, RepLevel.National, "Chicago")
  );

  const legislation = [...city, ...state, ...national];

  return legislation;
};
