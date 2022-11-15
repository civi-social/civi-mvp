import invariant from "tiny-invariant";
import ENVIRONMENT_VARIABLES from "../setup-scripts/env";

type Env = {
  [K in typeof ENVIRONMENT_VARIABLES[number]]: string;
};

export const getEnv = (): Env => {
  return ENVIRONMENT_VARIABLES.reduce((env, e) => {
    const value = process.env[e];
    // verify env exists
    invariant(typeof value === "string", `⛔️ ${e} env var not set.`);
    env[e] = value;
    return env;
  }, {} as Env);
};
