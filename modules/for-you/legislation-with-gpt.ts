import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "civi-legislation-data";

// todo: put this type directly in civi-legislation-data
type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

export type CiviLegislationDataWithGpt = CiviLegislationData & {
  gpt?: CiviGptData;
};

export const mapGptDataToLegislation = ({
  legislation,
  gpt,
}: {
  legislation: CiviLegislationData[];
  gpt: CiviGptLegislationData;
}): CiviLegislationDataWithGpt[] => {
  return legislation.map(
    (bill) =>
      ({
        ...bill,
        gpt: gpt[bill.id],
      } as CiviLegislationDataWithGpt)
  );
};
