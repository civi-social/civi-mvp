import type { FC } from "react";
import type { OfficialOffice } from "~/entities/representatives";
import Channel from "../Channel/Channel";
import ResultCard from "../ResultCard/ResultCard";

const OfficialOfficeList: FC<{
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
                  <Channel {...channel} />
                </li>
              ))}
              {s.official.phones?.map((id) => (
                <li key={id}>
                  <Channel type="Phone" id={id} />
                </li>
              ))}
              {s.official.emails?.map((id) => (
                <li key={id}>
                  <Channel type="Email" id={id} />
                </li>
              ))}
              {s.official.urls?.map((id) => (
                <li key={id}>
                  <Channel type="URL" id={id} />
                </li>
              ))}
            </>
          }
        />
      ))}
    </>
  );
};

export default OfficialOfficeList;
