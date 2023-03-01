import { useState } from "react";
import type { Env } from "~/config";
import { RepLevel } from "~/levels";
import type { StyleHack } from "~/ui";
import { AddressLookup } from "~/ui";
import { RadioPicker } from "~/ui";
import { DataField, Skin, Spacing } from "~/ui";
import type { ForYouBill } from "../selector";

const Tag: React.FC<{ backgroundColor?: string; text: string }> = ({
  backgroundColor,
  text,
}) => {
  return (
    <span
      style={{
        backgroundColor: backgroundColor
          ? backgroundColor
          : ("grey" as StyleHack),
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

const Tagging = ({
  tags,
  filters,
  updateFilters,
}: {
  tags: string[];
  filters: FilterParams;
  updateFilters: UpdateFiltersFn;
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    filters.tags ?? []
  );

  const handleTagClick = (tag: string) => {
    let updatedTags: string[] = [];
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }
    updateFilters({ ...filters, tags: updatedTags });
    setSelectedTags(updatedTags);
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
            fontSize: "10px",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export interface FilterParams {
  address?: string | null;
  tags?: string[] | null;
  level?: RepLevel | null;
}

export type UpdateFiltersFn = (p: FilterParams) => void;

export const ForYou = ({
  legislation,
  tags,
  updateFilters,
  filters,
  env,
}: {
  legislation: ForYouBill[];
  tags: string[];
  updateFilters: UpdateFiltersFn;
  filters: FilterParams;
  env: Env;
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
        <div style={{ background: "#99cc99" as StyleHack }}>
          <AddressLookup env={env} />
        </div>
        <RadioPicker<RepLevel | null | undefined>
          handleChange={(next) => {
            if (!next) {
              updateFilters({
                ...filters,
                level: null,
              });
            } else {
              updateFilters({
                ...filters,
                level: next,
              });
            }
          }}
          defaultValue={filters.level}
          options={[
            { label: "All", value: "" },
            { label: "City", value: RepLevel.City },
            { label: "State", value: RepLevel.State },
            { label: "National", value: RepLevel.National },
          ]}
        />
        <Tagging tags={tags} filters={filters} updateFilters={updateFilters} />
        {legislation.map(
          ({
            bill: { id, title, statusDate, link, description },
            gpt,
            level,
            sponsoredByRep,
          }) => (
            <div key={id + title} style={{ marginTop: Spacing.FOUR }}>
              <div className="flex flex-col gap-y-2 rounded-lg border border-solid border-gray-200 px-4 py-2">
                <span>{id}</span>
                {sponsoredByRep && (
                  <Tag
                    backgroundColor="red"
                    text={`Sponsored By Your Rep: ${sponsoredByRep}`}
                  ></Tag>
                )}
                {gpt?.gpt_tags && (
                  <div>
                    {gpt.gpt_tags.map((v) => (
                      <Tag key={v} text={v} />
                    ))}
                  </div>
                )}
                {level !== RepLevel.City && (
                  <div className="text-lg">{title}</div>
                )}
                {gpt?.gpt_summary && (
                  <h4 className="text-xl font-semibold">{gpt.gpt_summary}</h4>
                )}
                <div style={{ fontFamily: "monospace" }}>{description}</div>
                <ul className="flex list-none flex-wrap items-center gap-x-2">
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
