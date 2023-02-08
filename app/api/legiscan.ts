import axios from "axios";
import type { Env } from "~/config";
import type { LegislationData } from "~/entities/legislation";
import { legiscanResultToIllinoisLegislation } from "~/entities/locales/illinois";
import type {
  LegiscanBill,
  LegiscanResult,
  LegiscanResults,
} from "./legiscan.types";

const legiscanResultToLegiscanBills = (
  data: LegiscanResult
): LegiscanBill[] => {
  // all results are a numbered string, except the "session" key
  delete data.masterlist.session;
  const bills = Object.values(data.masterlist as LegiscanResults);
  return bills;
};

const getIllinoisBills = async (env: Env): Promise<LegislationData[]> => {
  console.log("Get Illinois Bills");
  try {
    const sessionId = "2020"; // todo: get from api
    const results = await axios.get<LegiscanResult>(
      `https://api.legiscan.com/?op=getMasterList&id=${sessionId}&key=${env.LEGISCAN_API_KEY}`
    );

    const bills = legiscanResultToLegiscanBills(results.data);
    const legislations = legiscanResultToIllinoisLegislation(bills);

    return legislations;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const legiscan = {
  getIllinoisBills,
};
