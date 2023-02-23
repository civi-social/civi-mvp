export interface Session {
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

export interface LegiscanMasterListBill {
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

export interface LegiscanBillByID {
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

export type SessionMetaData = {
  session?: Session;
};

export type LegiscanResults = {
  [number: string]: LegiscanMasterListBill;
};

export type Masterlist = SessionMetaData & LegiscanResults;

export interface LegiscanResult {
  status: string;
  masterlist: Masterlist;
}

export interface LegiscanBillResult {
  status: string;
  bill: LegiscanBillByID;
}

// https://api.legiscan.com/dl/LegiScan_API_User_Manual.pdf
export const STATUS_MAP: { [k: number]: string } = {
  1: "Intro",
  2: "Engross",
  3: "Enroll",
  4: "Pass",
  5: "Veto",
};
