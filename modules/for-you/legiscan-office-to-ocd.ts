import type { CiviLegislationData } from "civi-legislation-data";
import { RepLevel } from "~/levels";

export const convertLegiscanDistrictToOcd = (
  sponsors: CiviLegislationData["sponsors"],
  level: RepLevel,
  stateAbbreviation: "il"
) => {
  return sponsors.map((sponsor) => {
    return {
      ...sponsor,
      district:
        level === RepLevel.State
          ? legiscanStateRepDistrictToOcd(
              // todo: make generic
              stateAbbreviation,
              sponsor.district
            )
          : level === RepLevel.National
          ? legiscanFederalRepDistrictToOcd(sponsor.district)
          : sponsor.district,
    };
  });
};

// Legiscan types house/senate names with names like HD-008 or SD-006,
// while Google uses the open civi data model. Convert Legiscan to open civic data.
const legiscanStateRepDistrictToOcd = (state: "il", district: string) => {
  // first split the district number by the dash
  const [type, districtNumberStr] = district.split("-");
  // begin creating the ocd prefix
  let prefix = "";
  // house
  if (type === "HD") {
    prefix = "sldl";
  }
  // senate
  if (type === "SD") {
    prefix = "sldu";
  }
  // remove preceding zero
  const districtNum = Number(districtNumberStr);

  // create divisionId
  let divisionId = "ocd-division/country:us";
  if (state) {
    divisionId += `/state:${state}`;
  }
  divisionId += `/${prefix}:${districtNum}`;
  return divisionId;
};

// example HD-MN-1
const legiscanFederalRepDistrictToOcd = (district: string) => {
  // first split the district number by the dash
  const [type, state, districtNumberStr] = district.split("-");

  let divisionId = "ocd-division/country:us";

  // begin creating the ocd prefix
  let prefix = "";
  // house
  if (type === "HD") {
    prefix = "cd";
    const districtNum = Number(districtNumberStr);
    divisionId += `/state:${state.toLowerCase()}`;
    divisionId += `/${prefix}:${districtNum}`;
    return divisionId;
  }
  // senate
  if (type === "SD") {
    divisionId += `/state:${state.toLowerCase()}`;
    return divisionId;
  }
  // it shouldn't get here as only people like the president don't have
  // state jurisdiction
  return divisionId;
};
