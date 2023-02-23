import type { LegiscanBill } from "modules/legislation/api/legiscan.types";
import { STATUS_MAP } from "modules/legislation/api/legiscan.types";
import type { LegislationData } from "modules/legislation";

export const legiscanResultToUSALegislation = (
  bills: LegiscanBill[]
): LegislationData[] => {
  return (
    bills
      // only show bills that are passed introduction stage
      .filter((bill) => bill.status > 1)
      .map((bill): LegislationData => {
        return {
          status: STATUS_MAP[bill.status] || "",
          date: bill.last_action_date,
          // only get first two sentences
          description: bill.description,
          sponsor: "",
          id: bill.number,
          title: bill.title,
          link: bill.url,
          tags: [],
        };
      })
  );
};
