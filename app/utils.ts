import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import axios from "axios";
import * as cheerio from "cheerio";

import type { Env } from "~/config";
import type { Bill, ChicagoBill, Locales } from "~/entities/bills";
import type { GoogleRepresentativesResponse } from "~/entities/representatives";
import { transformGoogleCivicInfo } from "~/entities/representatives";
import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("routes/index");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export const getChicagoBills = async (): Promise<ChicagoBill[]> => {
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

export const getBills = async (locale: Locales | null): Promise<Bill[]> => {
  console.log("getting bills for", locale);
  let cityData: Bill[] = [];
  switch (locale) {
    case "Chicago":
      cityData = await getChicagoBills();
      break;
    default:
      cityData = [];
      break;
  }
  return cityData;
};

export const getRepresentatives = async (address: string, env: Env) => {
  console.log("searching for representatives for", address);
  const results = await axios.get<GoogleRepresentativesResponse>(
    `https://www.googleapis.com/civicinfo/v2/representatives`,
    { params: { key: env.GOOGLE_API_KEY, address } }
  );

  return transformGoogleCivicInfo(results.data);
};
