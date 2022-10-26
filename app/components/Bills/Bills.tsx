import type { FC } from "react";
import type { Bill } from "~/entities/bills";
import Channel from "../Channel/Channel";
import ResultCard from "../ResultCard/ResultCard";

type Props = {
  bills: Bill[];
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
              <Channel type="Text" id={id} />
              <Channel type="Text" id={sponsor} />
              <Channel type="URL" id={link} />
            </>
          }
        />
      ))}
    </>
  );
};

export default Bills;
