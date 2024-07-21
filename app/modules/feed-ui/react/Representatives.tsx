import { useState, type FC } from "react";
import { getLegislators } from "~app/modules/data/representatives";
import type { OfficialOffice } from "~app/modules/data/representatives/representatives.types";
import { DataField, ResultCard } from "~app/modules/design-system";
import { FYBFilterProps } from "../feed-ui.types";

export const RepresentativesList: FC<{
  officialOffice: OfficialOffice[];
}> = ({ officialOffice }) => {
  return (
    <>
      {officialOffice.map((s: OfficialOffice) => (
        <RepresentativeCard key={s.official.name} {...s} />
      ))}
    </>
  );
};

export const RepresentativeCard = (s: OfficialOffice) => {
  return (
    <ResultCard
      key={s.office.name + s.official.name}
      title={s.office.name}
      subtitle={s.official.name}
      channels={
        <>
          {s.official.channels?.map((channel) => (
            <li key={channel.type + channel.id}>
              <DataField {...channel} />
            </li>
          ))}
          {s.official.phones?.map((id) => (
            <li key={id}>
              <DataField type="Phone" id={id} />
            </li>
          ))}
          {s.official.emails?.map((id) => (
            <li key={id}>
              <DataField type="Email" id={id} />
            </li>
          ))}
          {s.official.urls?.map((id) => (
            <li key={id}>
              <DataField type="URL" id={id} />
            </li>
          ))}
        </>
      }
    />
  );
};

export const Legislator = (
  person: ReturnType<typeof getLegislators>[0] & {
    onClick: (key: string) => void;
  }
) => {
  return (
    <span
      role="button"
      className="cursor-pointer select-text underline decoration-dotted hover:underline"
      onClick={() => person.onClick(getRepKey(person))}
    >
      <span className="opacity-80">{person.title}</span>{" "}
      <span className="">{person.name}</span>
    </span>
  );
};

type LegislatorsFunc = {
  offices: OfficialOffice[] | null;
  showAllReps: FYBFilterProps["showAllReps"];
};

export const Legislators = ({ offices, showAllReps }: LegislatorsFunc) => {
  const [officeToShow, setShowOfficeToShow] = useState("");
  const officialOffice = offices?.find(
    (office) => getRepKey(office) === officeToShow
  );
  return (
    <>
      {getLegislators(offices).map((person) => (
        <div key={person.name} className="mb-1">
          {officialOffice && getRepKey(person) === getRepKey(officialOffice) ? (
            <div key={person.name} className="m-2">
              <RepresentativeCard {...officialOffice} />
            </div>
          ) : (
            <Legislator
              {...person}
              onClick={(key) => {
                setShowOfficeToShow(key);
              }}
            />
          )}
        </div>
      ))}
      <div
        role="button"
        className="inline-block rounded bg-opacity-50 uppercase text-white underline decoration-dotted"
        onClick={showAllReps}
      >
        See More
      </div>
    </>
  );
};

export const LegislatorsToggle = (props: LegislatorsFunc) => {
  const [showSponsorBoxMobile, setShowSponsorBoxMobile] = useState(false);

  return showSponsorBoxMobile ? (
    <div className="rounded bg-black bg-opacity-20 p-2 text-xs">
      <Legislators offices={props.offices} showAllReps={props.showAllReps} />
    </div>
  ) : (
    <div
      className="inline-block cursor-pointer rounded bg-black bg-opacity-20 px-5 py-1 text-xs underline decoration-dotted"
      onClick={() => setShowSponsorBoxMobile(true)}
    >
      See Your Representatives
    </div>
  );
};

const getRepKey = (person: {
  official: { name: string };
  office: { name: string };
}) => person.office.name + person.official.name;
