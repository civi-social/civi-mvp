import type { FC } from "react";
import type { LegislationData } from "~/modules/legislation";
import { DataField } from "../../../components/DataField/DataField";
import { ResultCard } from "../../../components/ResultCard/ResultCard";

type Props = {
  bills: LegislationData[];
};

export const Bills: FC<Props> = ({ bills }) => {
  return (
    <>
      {bills.map(({ id, title, date, sponsor, link, description }) => (
        <ResultCard
          key={id + title}
          title={title}
          subtitle={description}
          channels={
            <>
              <DataField type="Text" id={id} />
              {sponsor && <DataField type="Text" id={sponsor} />}
              <DataField type="Text" id={date} />
              <DataField type="URL" id={link} />
            </>
          }
        />
      ))}
    </>
  );
};
