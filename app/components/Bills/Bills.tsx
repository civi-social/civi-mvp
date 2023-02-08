import type { FC } from "react";
import type { LegislationData } from "~/entities/legislation";
import { DataField } from "../DataField/DataField";
import { ResultCard } from "../ResultCard/ResultCard";

type Props = {
  bills: LegislationData[];
};

const Bills: FC<Props> = ({ bills }) => {
  return (
    <>
      {bills.map(({ id, title, date, sponsor, link }) => (
        <ResultCard
          key={id}
          title={title}
          subtitle={date}
          channels={
            <>
              <DataField type="Text" id={id} />
              <DataField type="Text" id={sponsor} />
              <DataField type="URL" id={link} />
            </>
          }
        />
      ))}
    </>
  );
};

export default Bills;
