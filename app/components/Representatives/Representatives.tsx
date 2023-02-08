import type { FC } from "react";
import type { LegislationData, Locales } from "~/entities/bills";
import type { RepresentativesResult } from "~/entities/representatives";
import { RepLevel } from "~/types";
import Bills from "../Bills/Bills";
import OfficialOfficeList from "../OfficialOfficeList/OfficialOfficeList";

type Props = {
  formattedAddress: string | null;
  representatives: RepresentativesResult | null;
  bills: LegislationData[];
  level: RepLevel;
};

const getLocale = (formattedAddress: string | null): null | Locales => {
  return formattedAddress && /Chicago, IL/gi.test(formattedAddress)
    ? "Chicago"
    : null;
};

const Representatives: FC<Props> = ({
  level,
  formattedAddress,
  representatives,
  bills,
}) => {
  const locale = getLocale(formattedAddress);
  const shouldShowBills = level === RepLevel.City && Boolean(locale);
  return (
    <div
      className={`grid w-full max-w-5xl gap-8 px-4 pb-8 ${
        shouldShowBills ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {shouldShowBills && (
        <div className="flex flex-col gap-y-5">
          <h1 className="text-3xl font-bold">Active Resolutions</h1>
          <Bills bills={bills} />
        </div>
      )}
      <div className="flex w-full max-w-2xl flex-col gap-y-5 justify-self-center">
        <h1 className="text-3xl font-bold">Your Representatives</h1>
        <OfficialOfficeList
          officialOffice={representatives?.offices[level] ?? []}
        />
      </div>
    </div>
  );
};

export default Representatives;
