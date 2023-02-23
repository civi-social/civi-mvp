import axios from "axios";
import type { Env } from "~/config";
import type { LegislationData } from "../legislation.types";
import { legiscanResultToIllinoisLegislation } from "../localities/illinois";
import { legiscanResultToUSALegislation } from "../localities/usa";
import { legislationCache } from "./legislation-cache";
import type {
  LegiscanBillResult,
  LegiscanMasterListBill,
  LegiscanResult,
  LegiscanResults,
} from "./legiscan.types";
import { STATUS_MAP } from "./legiscan.types";

const legiscanResultToLegiscanMasterListBills = (
  data: LegiscanResult
): LegiscanMasterListBill[] => {
  // all results are a numbered string, except the "session" key
  delete data.masterlist.session;
  const bills = Object.values(data.masterlist as LegiscanResults);
  return bills;
};

const getMasterList = async (
  env: Env,
  sessionId: string
): Promise<LegiscanMasterListBill[]> => {
  console.log("Get Master List", sessionId);
  try {
    const cacheKey = `legiscan:getMasterList:${sessionId}`;
    const cachedData = legislationCache.get(cacheKey);
    if (cachedData) {
      return cachedData as LegiscanMasterListBill[];
    }

    const results = await axios.get<LegiscanResult>(
      `https://api.legiscan.com/?op=getMasterList&id=${sessionId}&key=${env.LEGISCAN_API_KEY}`
    );

    const bills = legiscanResultToLegiscanMasterListBills(results.data);

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
    const masterList = await getMasterList(env, sessionId);
    const masterListLegislations =
      legiscanResultToIllinoisLegislation(masterList);

    const billDetailPromises = masterListLegislations.map((l) => {
      console.log("getting bill data for ", l.source_id);
      return axios.get<LegiscanBillResult>(
        `https://api.legiscan.com/?op=getBill&id=${l.source_id}&key=${env.LEGISCAN_API_KEY}`
      );
    });
    const legislationsResults = await Promise.all(billDetailPromises);
    console.log("hi", legislationsResults);

    const legislations = legislationsResults
      .map((res) => res.data.bill)
      .map((bill): LegislationData => {
        const title = bill.description
          .split(".")[0]
          .replace("Creates the ", "")
          .replace("Amends the ", "Amend the ");

        const description =
          bill.description.split(".").slice(1, 3).join(".") + ".";

        return {
          status: STATUS_MAP[bill.status] || "",
          date: bill.last_action_date,
          // only get first two sentences
          description,
          sponsors: [],
          // sponsors: bill.sponsors.map((s) => s.name),
          source_id: String(bill.bill_id),
          id: bill.number,
          title,
          link: bill.url,
          tags: [],
        };
      });
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
    const masterListLegislations = legiscanResultToUSALegislation(bills);
    const billDetailPromises = masterListLegislations.map((l) =>
      axios.get<LegiscanBillResult>(
        `https://api.legiscan.com/?op=getBill&id=${l.source_id}&key=${env.LEGISCAN_API_KEY}`
      )
    );
    const legislationsResults = await Promise.all(billDetailPromises);
    const legislations = legislationsResults
      .map((res) => res.data.bill)
      .map((bill): LegislationData => {
        const title = bill.description
          .split(".")[0]
          .replace("Creates the ", "")
          .replace("Amends the ", "Amend the ");

        const description =
          bill.description.split(".").slice(1, 3).join(".") + ".";

        return {
          status: STATUS_MAP[bill.status] || "",
          date: bill.last_action_date,
          // only get first two sentences
          description,
          sponsors: [],
          // sponsors: bill.sponsors.map((s) => s.name),
          source_id: String(bill.bill_id),
          id: bill.number,
          title,
          link: bill.url,
          tags: [],
        };
      });
    return legislations;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const legiscan = {
  getIllinoisBills,
  getNationalBills,
};
