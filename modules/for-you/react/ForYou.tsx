import type { Env } from "~/config";
import { RepLevel } from "~/levels";
import type { Style, StyleHack } from "~/ui";
import {
  AddressLookup,
  DataField,
  RadioPicker,
  Spacing,
  Tag,
  Tagging,
} from "~/ui";
import type { ForYouBill } from "../selector";

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
    <div style={styles.flexCenter}>
      <div style={styles.mainContainer}>
        <div style={styles.filterContainer}>
          <div style={styles.addressContainer}>
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
          <Tagging
            tags={tags}
            selected={filters.tags || []}
            handleClick={(updatedTags) => {
              updateFilters({ ...filters, tags: updatedTags });
            }}
          />
        </div>
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

const styles: Style.StyleSheet<
  "mainContainer" | "addressContainer" | "flexCenter" | "filterContainer"
> = {
  flexCenter: {
    display: "flex",
    justifyContent: "center",
  },
  mainContainer: {
    maxWidth: "500px",
    alignContent: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    marginBottom: Spacing.FOUR,
  },
  addressContainer: {
    // background: "#99cc99" as StyleHack,
  },
  filterContainer: {
    padding: Spacing.FOUR,
  },
};
