import type { Env } from "~/config";
import { RepLevel } from "~/levels";
import type { Style, StyleHack } from "~/ui";
import { Skin } from "~/ui";
import {
  AddressLookup,
  DataField,
  RadioPicker,
  Spacing,
  Tag,
  Tagging,
} from "~/ui";
import type { ForYouBill } from "../selector";

import React, { useState, useEffect } from "react";

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
    <div>
      <OverlapSection
        style={{
          background:
            "linear-gradient(45deg, rgba(255,82,37,1) 0%, rgba(255,29,135,1) 100%)" as StyleHack,
        }}
      >
        <div style={styles.flexCenter}>
          <div style={styles.mainContainer}>
            <div style={styles.filterContainer}>
              <div style={styles.addressContainer}>
                <AddressLookup env={env} />
              </div>
              <RadioPicker<RepLevel | null | undefined | "">
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
                defaultValue={filters.level || ""}
                options={[
                  { label: "All", value: "" },
                  { label: "City", value: RepLevel.City },
                  { label: "State", value: RepLevel.State },
                  { label: "National", value: RepLevel.National },
                ]}
              />
              <div style={{ backgroundColor: "rgba(0,0,0,0.7)" as StyleHack }}>
                <Tagging
                  tags={tags}
                  selected={filters.tags || []}
                  handleClick={(updatedTags) => {
                    updateFilters({ ...filters, tags: updatedTags });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </OverlapSection>
      <OverlapSection
        style={{ backgroundColor: "rgba(255,255,255,1.0)" as StyleHack }}
      >
        <div style={styles.flexCenter}>
          <div style={{ ...styles.mainContainer }}>
            {legislation.map(
              ({
                bill: { id, title, statusDate, link, description },
                gpt,
                level,
                sponsoredByRep,
              }) => (
                <div
                  style={{ ...styles.cardContainer }}
                  key={id + title}
                  className="flex flex-col gap-y-2 px-4 py-2"
                >
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
              )
            )}
          </div>
        </div>
      </OverlapSection>
    </div>
  );
};

const OverlapSection: React.FC<{ style?: Style.Properties }> = ({
  children,
  style,
}) => {
  return (
    <section
      style={{
        position: "sticky",
        top: "0",
        padding: "30px 30px 30px 30px" as StyleHack,
        minHeight: "20vh",
        ...style,
      }}
    >
      {children}
    </section>
  );
};

const styles: Style.StyleSheet<
  | "mainContainer"
  | "addressContainer"
  | "flexCenter"
  | "filterContainer"
  | "cardContainer"
> = {
  cardContainer: {
    border: "1px solid rgba(0,0,0,0.1)",
    background: Skin.White,
    marginTop: Spacing.FOUR,
  },
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
    background: "rgba(0,0,0,0.7)" as StyleHack,
  },
  filterContainer: {
    padding: Spacing.FOUR,
  },
};
