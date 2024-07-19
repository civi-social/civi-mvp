import type { FC } from "react";
import type { OfficialOffice } from "~/representatives/representatives.types";
import { DataField, ResultCard } from "~/ui";

export const OfficialOfficeList: FC<{
  officialOffice: OfficialOffice[];
}> = ({ officialOffice }) => {
  return (
    <>
      {officialOffice.map((s: OfficialOffice) => (
        <RepresentativeCard {...s} />
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
