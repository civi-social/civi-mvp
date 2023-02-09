import type {
  Divisions,
  GoogleRepresentativesResponse,
  Office,
  Official,
} from "~/api/google.types";

export interface OfficialOffice {
  office: Office;
  official: Official;
}

export interface RepresentativesOcIdResult {
  offices: Office[];
  officials: Official[];
  divisions: Divisions;
}

export interface RepresentativesResult {
  normalizedInput: GoogleRepresentativesResponse["normalizedInput"];
  offices: {
    national: OfficialOffice[];
    state: OfficialOffice[];
    county: OfficialOffice[];
    city: OfficialOffice[];
  };
}

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
