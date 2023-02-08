import axios from "axios";
import type { Env } from "~/config";
import type { LegislationData } from "~/entities/legislation";

interface Session {
  session_id: number;
  state_id: number;
  year_start: number;
  year_end: number;
  prefile: number;
  sine_die: number;
  prior: number;
  special: number;
  session_tag: string;
  session_title: string;
  session_name: string;
}

interface LegiscanBill {
  bill_id: number;
  number: string;
  change_hash: string;
  url: string;
  status_date: string;
  status: number;
  last_action_date: string;
  last_action: string;
  title: string;
  description: string;
}

type SessionMetaData = {
  session?: Session;
};

type LegiscanResults = {
  [number: string]: LegiscanBill;
};

type Masterlist = SessionMetaData & LegiscanResults;

interface LegiscanResult {
  status: string;
  masterlist: Masterlist;
}

const legiscanResultToLegiscanBills = (
  data: LegiscanResult
): LegiscanBill[] => {
  // all results are a numbered string, except the "session" key
  delete data.masterlist.session;
  const bills = Object.values(data.masterlist as LegiscanResults);
  return bills;
};

// https://api.legiscan.com/dl/LegiScan_API_User_Manual.pdf
const STATUS_MAP: { [k: number]: string } = {
  1: "Intro",
  2: "Engross",
  3: "Enroll",
  4: "Pass",
  5: "Veto",
};

const getNumberFromBill = (s: string): number =>
  Number(s.substring(s.length - 4));

const legiscanBillsToLegislationData = (
  bills: LegiscanBill[]
): LegislationData[] => {
  return (
    bills
      // for now, only get legislation data that is related to creating or amending bills
      .filter((bill) => {
        const firstSentence = bill.description.split(".")[0];
        return (
          firstSentence.includes("Creates the ") ||
          firstSentence.includes("Amends the ")
        );
      })
      .filter((bill) => bill.title !== "BUDGET IMPLEMENTATION-TECH")
      // don't include task forces
      .filter((bill) => !bill.number.includes("HJR"))
      .filter((bill) => !bill.number.includes("SJR"))
      // ignore unfinished bills
      .filter(
        (bill) =>
          !bill.description.includes("Contains only a short title provision.")
      )
      // only get first 50 bills from senate or house
      .filter((bill) => getNumberFromBill(bill.number) < 50)
      // ignore code changes for now
      .filter((bill) => !bill.description.split(".")[0].includes("Code"))
      // ignore technical changes
      .filter(
        (bill) =>
          !bill.description.split(".")[1].includes("Makes a technical change")
      )
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
          sponsor: "",
          id: bill.number,
          title,
          link: bill.url,
          tags: [],
        };
      })
      .sort((a, b) =>
        getNumberFromBill(a.id) > getNumberFromBill(b.id) ? 1 : -1
      )
  );
};

const getIllinoisBills = async (env: Env): Promise<LegislationData[]> => {
  console.log("Get Illinois Bills");
  try {
    const sessionId = "2020"; // todo: get from api
    const results = await axios.get<LegiscanResult>(
      `https://api.legiscan.com/?op=getMasterList&id=${sessionId}&key=${env.LEGISCAN_API_KEY}`
    );

    const bills = legiscanResultToLegiscanBills(results.data);
    const legislations = legiscanBillsToLegislationData(bills);

    return legislations;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const legiscan = {
  getIllinoisBills,
};
