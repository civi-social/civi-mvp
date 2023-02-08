import axios from "axios";
import type { Env } from "~/config";
import type { GoogleRepresentativesResponse } from "~/entities/representatives";
import { transformGoogleCivicInfo } from "~/entities/representatives";

const getRepresentatives = async (address: string, env: Env) => {
  console.log("searching for representatives for", address);
  const results = await axios.get<GoogleRepresentativesResponse>(
    `https://www.googleapis.com/civicinfo/v2/representatives`,
    { params: { key: env.GOOGLE_API_KEY, address } }
  );

  return transformGoogleCivicInfo(results.data);
};

const getChicagoWard = async (id: string, env: Env) => {
  console.log("searching for ward by id", id);
  // https://github.com/opencivicdata/ocd-division-ids/blob/master/identifiers/country-us/state-il-local_gov.csv
  const results = await axios.get<GoogleRepresentativesResponse>(
    `https://www.googleapis.com/civicinfo/v2/representatives/ocd-division%2Fcountry%3Aus%2Fstate%3Ail%2Fplace%3Achicago%2Fward%3A${id}`,
    { params: { key: env.GOOGLE_API_KEY } }
  );

  return results.data;
};

export const google = {
  getRepresentatives,
  getChicagoWard,
};
