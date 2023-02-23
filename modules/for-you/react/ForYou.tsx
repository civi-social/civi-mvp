import type { LegislationData } from "~/legislation";
import { DataField, ResultCard, Spacing } from "~/ui";

export const ForYou = ({ legislation }: { legislation: LegislationData[] }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: "500px",
          alignContent: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {legislation.map(({ id, title, date, sponsor, link, description }) => (
          <div key={id + title} style={{ marginTop: Spacing.FOUR }}>
            <ResultCard
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
          </div>
        ))}
      </div>
    </div>
  );
};
