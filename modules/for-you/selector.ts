import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import type { RepLevel } from "~/levels";
import type { RepresentativesResult } from "~/representatives";
import { convertLegiscanDistrictToOcd } from "./legiscan-office-to-ocd";
import { findOverlap } from "./utils";

// todo: put this type directly in civi-legislation-data
type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

export type ForYouBill = {
  bill: CiviLegislationData;
  gpt?: CiviGptData;
  level: RepLevel;
  sponsoredByRep?: string | false;
};

export const selectData = (
  {
    legislation,
    gpt,
  }: {
    legislation: CiviLegislationData[];
    gpt: CiviGptLegislationData;
  },
  level: RepLevel,
  representatives: RepresentativesResult | null,
  stateAbbreviation: "il"
): ForYouBill[] => {
  return legislation.map((bill) => {
    const sponsors = convertLegiscanDistrictToOcd(
      bill.sponsors,
      level,
      stateAbbreviation
    );

    return {
      bill: {
        ...bill,
        sponsors,
      },
      gpt: gpt[bill.id],
      level,
      sponsoredByRep: findBillsSponsoredByRep(representatives, sponsors, level),
    } as ForYouBill;
  });
};

const findBillsSponsoredByRep = (
  representatives: RepresentativesResult | null,
  sponsors: CiviLegislationData["sponsors"],
  level: RepLevel
): string | false => {
  const divisions = representatives?.offices[level]?.map(
    (o) => o.office.divisionId
  );
  const sponsoredOffice = findOverlap(
    divisions || [],
    sponsors.map((s) => s.district)
  );
  let sponsoredByRep: string | false = false;
  representatives?.offices[level].forEach((o) => {
    if (o.office.divisionId === sponsoredOffice) {
      sponsoredByRep = o.official.name;
    }
  });
  return sponsoredByRep;
};
