import type { LegiscanBill } from "modules/legislation/api/legiscan.types";
import { STATUS_MAP } from "modules/legislation/api/legiscan.types";
import type { LegislationData } from "modules/legislation";

/**
 * Illinois bills have either SB0000, HB0000, HJR0000, or SJR0000.
 * Get the number from the last 4
 */
const getNumberFromBill = (s: string): number =>
  Number(s.substring(s.length - 4));

/**
 * Converts the Legiscan master list to data that can be rendered by the UI
 */
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
      // Ignore budget bills for now. They are pretty complicated.
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
