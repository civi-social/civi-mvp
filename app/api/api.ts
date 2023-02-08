import axios from "axios";
import * as cheerio from "cheerio";

import type { Env } from "~/config";
import type { Bill, ChicagoBill, Locales } from "~/entities/bills";
import type { GoogleRepresentativesResponse } from "~/entities/representatives";
import { transformGoogleCivicInfo } from "~/entities/representatives";

/**
 * Scrape Councilmatic site for non-routine data
 * todo: stop scraping, use councilmatic's site to directly get the data
 */
const getChicagoBills = async (): Promise<ChicagoBill[]> => {
  const results = await axios.get(
    "https://chicago.councilmatic.org/search/?selected_facets=topics_exact%3ANon-Routine&selected_facets=inferred_status_exact%3AActive&selected_facets=bill_type_exact%3Aresolution&page=1"
  );

  const $ = cheerio.load(results.data);
  const legislationsHtml =
    $(".order-nav")?.html()?.split("<!-- Legislation result -->") ?? [];
  legislationsHtml.shift(); // remove first element that contains no data

  const legislationsJson = legislationsHtml.map((legislationHtml) => {
    const _$ = cheerio.load(legislationHtml);
    return {
      status: _$("span.label").text().trim(),
      date: _$("i.fa-calendar-o").parent().text().trim(),
      sponsor: _$("i.fa-user").parent().text().trim(),
      link: `https://chicago.councilmatic.org${_$("a.small")
        ?.attr("href")
        ?.trim()}`,
      id: _$("a.small").text().trim(),
      title: _$(".row .col-xs-11 p").text().trim(),
      tags: _$("i.fa-tag")
        .parent()
        .find(".badge")
        .map(function () {
          return _$(this).text().trim();
        })
        .toArray(),
    };
  });
  return legislationsJson;
};

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

type SessionMetaData = {
  session: Session;
};

export type Masterlist = SessionMetaData & {
  [number: string]: LegiscanBill;
};

export interface LegiscanResult {
  status: string;
  masterlist: Masterlist;
}

const getIllinoisBills = async (env: Env): Promise<Bill[]> => {
  const sessionId = "2020"; // todo: get from api
  const results = axios.get<LegiscanResult>(
    `https://api.legiscan.com/?op=getMasterList&id=${sessionId}&key=${env.LEGISCAN_API_KEY}`
  );
  return Promise.reject(results);
};

export const getBills = async (
  locale: Locales | null,
  env: Env
): Promise<Bill[]> => {
  console.log("getting bills for", locale);
  let bills: Bill[] = [];
  switch (locale) {
    case "Chicago":
      bills = await getChicagoBills();
      break;
    case "Illinois":
      bills = await getIllinoisBills(env);
    default:
      bills = [];
      break;
  }
  return bills;
};

export const getRepresentatives = async (address: string, env: Env) => {
  console.log("searching for representatives for", address);
  const results = await axios.get<GoogleRepresentativesResponse>(
    `https://www.googleapis.com/civicinfo/v2/representatives`,
    { params: { key: env.GOOGLE_API_KEY, address } }
  );

  return transformGoogleCivicInfo(results.data);
};

export const getWard = async (id: string, env: Env) => {
  console.log("searching for ward by id", id);
  // https://github.com/opencivicdata/ocd-division-ids/blob/master/identifiers/country-us/state-il-local_gov.csv
  const results = await axios.get<GoogleRepresentativesResponse>(
    `https://www.googleapis.com/civicinfo/v2/representatives/ocd-division%2Fcountry%3Aus%2Fstate%3Ail%2Fplace%3Achicago%2Fward%3A${id}`,
    { params: { key: env.GOOGLE_API_KEY } }
  );

  return results.data;
};
