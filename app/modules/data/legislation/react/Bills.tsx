import type { CiviLegislationData } from "civi-legislation-data";
import type { FC } from "react";
import { DataField, ResultCard } from "~app/modules/design-system";

type Props = {
  bills: CiviLegislationData[];
};

export const Bills: FC<Props> = ({ bills }) => {
  return (
    <>
      {bills.map(({ id, title, statusDate, sponsors, link, description }) => (
        <ResultCard
          key={id + title}
          title={title}
          subtitle={description}
          channels={
            <>
              <DataField type="Text" id={id} />
              {sponsors && (
                <DataField type="Text" id={sponsors.map((s) => s.name)?.[0]} />
              )}
              <DataField type="Text" id={statusDate} />
              <DataField type="URL" id={link} />
            </>
          }
        />
      ))}
    </>
  );
};
