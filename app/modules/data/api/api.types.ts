import { FeedBill } from "../legislation/legislation.types";
import { OfficialOffice } from "../representatives/representatives.types";

export type FeedData = {
  fullLegislation: FeedBill[];
  filteredLegislation: FeedBill[];
  offices: OfficialOffice[] | null;
};
