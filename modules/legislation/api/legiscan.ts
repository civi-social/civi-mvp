import axios from "axios";
import type { Env } from "~/config";
import type { LegislationData } from "../legislation.types";
import { legiscanResultToIllinoisLegislation } from "../localities/illinois";
import { legiscanResultToUSALegislation } from "../localities/usa";
import { legislationCache } from "./legislation-cache";
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

const getMasterList = async (
  env: Env,
  sessionId: string
): Promise<LegiscanBill[]> => {
  console.log("Get Master List", sessionId);
  try {
    const cacheKey = `legiscan:getMasterList:${sessionId}`;
    const cachedData = legislationCache.get(cacheKey);
    if (cachedData) {
      return cachedData as LegiscanBill[];
    }

    const results = await axios.get<LegiscanResult>(
      `https://api.legiscan.com/?op=getMasterList&id=${sessionId}&key=${env.LEGISCAN_API_KEY}`
    );

    const bills = legiscanResultToLegiscanBills(results.data);

    legislationCache.set(cacheKey, cachedData);

    return bills;
  } catch (e) {
    return Promise.reject(e);
  }
};

const getIllinoisBills = async (env: Env): Promise<LegislationData[]> => {
  console.log("Get Illinois Bills");
  try {
    const cacheKey = "illinois-bills";
    const cache = legislationCache.get(cacheKey);
    if (cache) {
      return cache as LegislationData[];
    }
    const sessionId = "2020"; // todo: get from api
    const bills = await getMasterList(env, sessionId);
    const legislations = legiscanResultToIllinoisLegislation(bills);
    legislationCache.set(cacheKey, legislations);
    return legislations;
  } catch (e) {
    return Promise.reject(e);
  }
};

const getNationalBills = async (env: Env): Promise<LegislationData[]> => {
  console.log("Get National Bills");
  try {
    // todo: get from api
    // https://api.legiscan.com/?op=getSessionList&state=US
    const sessionId = "2041";
    const bills = await getMasterList(env, sessionId);
    const legislations = legiscanResultToUSALegislation(bills);

    return legislations;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const legiscan = {
  getIllinoisBills,
  getNationalBills,
};
