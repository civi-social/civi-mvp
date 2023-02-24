import type { CiviLegislationData } from "civi-legislation-data";
import { DataField, ResultCard, Spacing } from "~/ui";

export const ForYou = ({
  legislation,
}: {
  legislation: CiviLegislationData[];
}) => {
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
        {legislation.map(
          ({ id, title, statusDate, sponsors, link, description }) => (
            <div key={id + title} style={{ marginTop: Spacing.FOUR }}>
              <ResultCard
                title={title}
                subtitle={description}
                channels={
                  <>
                    <DataField type="Text" id={id} />
                    {sponsors && (
                      <DataField
                        type="Text"
                        id={sponsors.map((s) => s.name).join(", ")}
                      />
                    )}
                    <DataField type="Text" id={statusDate} />
                    <DataField type="URL" id={link} />
                  </>
                }
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};
