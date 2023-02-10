import type { LegiscanBill } from "~/api/legiscan.types";
import { STATUS_MAP } from "~/api/legiscan.types";
import type { LegislationData } from "../legislation";

export const legiscanResultToUSALegislation = (
  bills: LegiscanBill[]
): LegislationData[] => {
  console.log("USA BILLS");
  return bills.map((bill): LegislationData => {
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
  });
};
