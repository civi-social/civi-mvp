import type { FC } from "react";
import type { OfficialOffice } from "~/modules/representatives/representatives.types";
import { DataField } from "~/components/DataField/DataField";
import { ResultCard } from "~/components/ResultCard/ResultCard";

export const OfficialOfficeList: FC<{
  officialOffice: OfficialOffice[];
}> = ({ officialOffice }) => {
  return (
    <>
      {officialOffice.map((s: OfficialOffice) => (
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
      ))}
    </>
  );
};
