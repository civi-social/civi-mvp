import type { GoogleRepresentativesResponse } from "~/representatives/api/google.types";
import type {
  OfficialOffice,
  RepresentativesResult,
} from "./representatives.types";
import { RepLevel, hasOverlap } from "../legislation";

export const transformGoogleCivicInfo = (
  data: GoogleRepresentativesResponse
): RepresentativesResult => {
  const offices = data.offices
    .map((office) => {
      return office.officialIndices.map((index) => ({
        official: data.officials[index],
        office,
      }));
    })
    .flat()
    .reverse();

  const response: RepresentativesResult = {
    normalizedInput: data.normalizedInput,
    offices: {
      city: offices.filter((off) => off.office.levels[0] === "locality"),
      county: offices.filter(
        (off) => off.office.levels[0] === "administrativeArea2"
      ),
      state: offices.filter(
        (off) => off.office.levels[0] === "administrativeArea1"
      ),
      national: offices.filter((off) => off.office.levels[0] === "country"),
    },
  };
  return response;
};

export const getLegislators = (
  offices?: OfficialOffice[] | null
): { title: string; name: string; link: string; level: RepLevel }[] => {
  if (!offices) {
    return [];
  }
  return (
    offices
      // We don't support county level
      .filter(
        (officialOffice) =>
          !officialOffice.office.divisionId.includes("county:")
      )
      .filter((officialOffice) =>
        hasOverlap(officialOffice.office.roles, [
          "legislatorLowerBody",
          "legislatorUpperBody",
        ])
      )
      .map((officialOffice) => {
        // last name attempt
        const name = officialOffice.official.name
          .replace(",", "")
          .replace(".", "")
          .replace("Jr.", "")
          .split(" ")
          .filter((name) => name.length > 1)
          .join(" ");
        return {
          title: officialOffice.office.name
            .replace("Chicago City Alderperson", "Alder")
            .replace("IL State Representative", "State Rep")
            .replace("IL State Senator", "State Senator")
            .replace("U.S. Representative", "Rep")
            .replace("U.S. Senator", "Senator"),
          name: name,
          link: officialOffice.official.urls[0],
          level: officialOffice.office.name.includes("Chicago")
            ? RepLevel.City
            : officialOffice.office.name.includes("IL")
            ? RepLevel.State
            : RepLevel.National,
        };
      })
  );
};
