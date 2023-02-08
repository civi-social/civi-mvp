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

export interface LegiscanBill {
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
  [number: string]: LegiscanBill;
};

export type Masterlist = SessionMetaData & LegiscanResults;

export interface LegiscanResult {
  status: string;
  masterlist: Masterlist;
}
