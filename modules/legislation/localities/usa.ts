import type { LegiscanMasterListBill } from "../api/legiscan.types";
import { STATUS_MAP } from "../api/legiscan.types";
import type { LegislationData } from "../legislation.types";

export const legiscanResultToUSALegislation = (
  bills: LegiscanMasterListBill[]
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
          sponsors: [],
          id: bill.number,
          title: bill.title,
          link: bill.url,
          tags: [],
        };
      })
  );
};
