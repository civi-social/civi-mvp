import type { GoogleRepresentativesResponse } from "modules/representatives/api/google.types";
import type { RepresentativesResult } from "./representatives.types";

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
