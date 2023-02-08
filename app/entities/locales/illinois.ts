import { STATUS_MAP } from "~/api/legiscan.types";
import type { LegiscanBill } from "~/api/legiscan.types";
import type { LegislationData } from "../legislation";

const getNumberFromBill = (s: string): number =>
  Number(s.substring(s.length - 4));

export const legiscanResultToIllinoisLegislation = (
  bills: LegiscanBill[]
): LegislationData[] => {
  return (
    bills
      // for now, only get legislation data that is related to creating or amending bills
      .filter((bill) => {
        const firstSentence = bill.description.split(".")[0];
        return (
          firstSentence.includes("Creates the ") ||
          firstSentence.includes("Amends the ")
        );
      })
      .filter((bill) => bill.title !== "BUDGET IMPLEMENTATION-TECH")
      // don't include task forces
      .filter((bill) => !bill.number.includes("HJR"))
      .filter((bill) => !bill.number.includes("SJR"))
      // ignore unfinished bills
      .filter(
        (bill) =>
          !bill.description.includes("Contains only a short title provision.")
      )
      // only get first 50 bills from senate or house
      .filter((bill) => getNumberFromBill(bill.number) < 50)
      // ignore code changes for now
      .filter((bill) => !bill.description.split(".")[0].includes("Code"))
      // ignore technical changes
      .filter(
        (bill) =>
          !bill.description.split(".")[1].includes("Makes a technical change")
      )
      .map((bill): LegislationData => {
        const title = bill.description
          .split(".")[0]
          .replace("Creates the ", "")
          .replace("Amends the ", "Amend the ");

        const description =
          bill.description.split(".").slice(1, 3).join(".") + ".";

        return {
          status: STATUS_MAP[bill.status] || "",
          date: bill.last_action_date,
          // only get first two sentences
          description,
          sponsor: "",
          id: bill.number,
          title,
          link: bill.url,
          tags: [],
        };
      })
      .sort((a, b) =>
        getNumberFromBill(a.id) > getNumberFromBill(b.id) ? 1 : -1
      )
  );
};
