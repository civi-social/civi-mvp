import { DataField, Spacing } from "~/ui";
import type { ForYouBill } from "../selector";

export const ForYou = ({
  legislation,
  tags,
}: {
  legislation: ForYouBill[];
  tags: string[];
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
          marginBottom: Spacing.FOUR,
        }}
      >
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
        {legislation.map(
          ({
            bill: { id, title, statusDate, sponsors, link, description },
            gpt,
          }) => (
            <div key={id + title} style={{ marginTop: Spacing.FOUR }}>
              <div className="flex flex-col gap-y-2 rounded-lg border border-solid border-gray-200 px-4 py-2">
                <span>{id}</span>
                {gpt?.gpt_tags && <div>{gpt.gpt_tags.join(" | ")}</div>}
                <div style={{ fontFamily: "monospace" }} className="text-lg">
                  {title}
                </div>
                {gpt?.gpt_summary && (
                  <h4 className="text-xl font-semibold">{gpt.gpt_summary}</h4>
                )}
                <div style={{ fontFamily: "monospace" }}>{description}</div>
                <ul className="flex list-none flex-wrap items-center gap-x-2">
                  {/* {sponsors && (
                    <DataField
                      type="Text"
                      id={sponsors.map((s) => s.name).join(", ")}
                    />
                  )} */}
                  <DataField type="Text" id={statusDate} />
                  <DataField type="URL" id={link} />
                </ul>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
