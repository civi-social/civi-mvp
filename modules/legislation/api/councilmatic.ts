import axios from "axios";
import * as cheerio from "cheerio";
import type { LegislationData } from "../legislation.types";
import { legislationCache } from "./legislation-cache";

/**
 * Scrape Councilmatic site for non-routine data
 * todo: stop scraping, use councilmatic's site to directly get the data
 */
const getChicagoBills = async (): Promise<LegislationData[]> => {
  const cachedData = legislationCache.get("councilmatic:chicago");
  if (cachedData) {
    console.log("Returning cached data");
    return cachedData as LegislationData[];
  }
  console.log("Scraping Chicago Bills from Councilmatic");
  try {
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
        sponsors: [_$("i.fa-user").parent().text().trim()],
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

    legislationCache.set("councilmatic:chicago", legislationsJson);

    return legislationsJson;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const councilmatic = {
  getChicagoBills,
};
