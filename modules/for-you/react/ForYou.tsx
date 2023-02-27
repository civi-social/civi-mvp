import { useLocation } from "@remix-run/react";
import type { StyleHack } from "~/ui";
import { Skin } from "~/ui";
import { DataField, Spacing } from "~/ui";
import type { ForYouBill } from "../selector";
import { useEffect, useState } from "react";
import { RepLevel } from "~/levels";

const Tag: React.FC<{ text: string }> = ({ children, text }) => {
  return (
    <span
      style={{
        backgroundColor: "grey" as StyleHack,
        color: Skin.White,
        padding: "5px 10px" as StyleHack,
        margin: "5px 5px 5px 0" as StyleHack,
        borderRadius: "20px",
        border: "none",
        fontSize: "12px",
      }}
    >
      {text}
    </span>
  );
};

export default function Tagging({ tags }: { tags: string[] }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",") ?? []
  );

  // useEffect(() => {
  //   // Update the URL parameters when the selected tags change
  //   const searchParams = new URLSearchParams(location.search);
  //   searchParams.set("tags", selectedTags.join(","));
  //   window.history.replaceState(null, "", `/?${searchParams.toString()}`);
  // }, [selectedTags, location.search]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    d;
  };

  return (
    <div>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          style={{
            backgroundColor: selectedTags.includes(tag)
              ? ("blue" as StyleHack)
              : ("grey" as StyleHack),
            color: Skin.White,
            padding: "5px 10px" as StyleHack,
            margin: "5px" as StyleHack,
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

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
        <Tagging tags={tags} />
        {legislation.map(
          ({
            bill: { id, title, statusDate, sponsors, link, description },
            gpt,
            level,
          }) => (
            <div key={id + title} style={{ marginTop: Spacing.FOUR }}>
              <div className="flex flex-col gap-y-2 rounded-lg border border-solid border-gray-200 px-4 py-2">
                <span>{id}</span>
                {gpt?.gpt_tags && (
                  <div>
                    {gpt.gpt_tags.map((v) => (
                      <Tag key={v} text={v} />
                    ))}
                  </div>
                )}
                {level !== RepLevel.City && (
                  <div className="text-lg">
                    {title}
                  </div>
                )}
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
