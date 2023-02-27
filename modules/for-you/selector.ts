import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";
import type { RepLevel } from "~/levels";

// todo: put this type directly in civi-legislation-data
type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

export type ForYouBill = {
  bill: CiviLegislationData;
  gpt?: CiviGptData;
  level: RepLevel;
};

export const selectData = (
  {
    legislation,
    gpt,
  }: {
    legislation: CiviLegislationData[];
    gpt: CiviGptLegislationData;
  },
  level: RepLevel
): ForYouBill[] => {
  return legislation.map(
    (bill) =>
      ({
        bill,
        gpt: gpt[bill.id],
        level,
      } as ForYouBill)
  );
};
