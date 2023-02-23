import type { FC } from "react";
import { Bills } from "~/legislation";
import type { LegislationData } from "~/legislation";
import type { RepLevel } from "~/levels";
import { OfficialOfficeList } from "~/representatives";
import type { RepresentativesResult } from "~/representatives";

type Props = {
  formattedAddress: string | null;
  representatives: RepresentativesResult | null;
  legislation: LegislationData[];
  level: RepLevel;
};

const Representatives: FC<Props> = ({
  level,
  representatives,
  legislation,
}) => {
  const shouldShowBills = legislation.length > 0;
  return (
    <div
      className={`grid w-full max-w-5xl gap-8 px-4 pb-8 ${
        shouldShowBills ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {shouldShowBills && (
        <div className="flex flex-col gap-y-5">
          <h1 className="text-3xl font-bold">Active Resolutions</h1>
          <Bills bills={legislation} />
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
