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
  session: Session;
};

type Masterlist = SessionMetaData & {
  [number: string]: LegiscanBill;
};

interface LegiscanResult {
  status: string;
  masterlist: Masterlist;
}

const getIllinoisBills = async (env: Env): Promise<LegislationData[]> => {
  try {
    const sessionId = "2020"; // todo: get from api
    const results = axios.get<LegiscanResult>(
      `https://api.legiscan.com/?op=getMasterList&id=${sessionId}&key=${env.LEGISCAN_API_KEY}`
    );
    return Promise.reject(results);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const legiscan = {
  getIllinoisBills,
};
