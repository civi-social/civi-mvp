import type { Env } from "~/config";
import { RepLevel } from "~/levels";
import type { Style, StyleHack } from "~/ui";
import { AddressLookup, RadioPicker, Skin, Spacing, Tag, Tagging } from "~/ui";
import type { ForYouBill } from "../selector";

import React from "react";
import { FaGlobe } from "react-icons/fa";

const RobotSvg = `<?xml version='1.0' encoding='iso-8859-1'?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 462 462" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 462 462">
  <g>
    <path d="m167,142c4.142,0 7.5-3.358 7.5-7.5v-8c0-4.142-3.358-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v8c0,4.142 3.357,7.5 7.5,7.5z"/>
    <path d="m295,142c4.142,0 7.5-3.358 7.5-7.5v-8c0-4.142-3.358-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v8c0,4.142 3.357,7.5 7.5,7.5z"/>
    <path d="m382.5,336.234v-67.468c9.29-3.138 16-11.93 16-22.266 0-12.958-10.542-23.5-23.5-23.5h-34.11c10.826-10.135 17.61-24.536 17.61-40.5v-80c0-30.603-24.897-55.5-55.5-55.5h-24.5v-20.114c4.188-2.546 7-7.138 7-12.386 0-7.995-6.505-14.5-14.5-14.5s-14.5,6.505-14.5,14.5c0,5.248 2.812,9.84 7,12.386v20.114h-65v-20.114c4.188-2.546 7-7.138 7-12.386 0-7.995-6.505-14.5-14.5-14.5s-14.5,6.505-14.5,14.5c0,5.248 2.812,9.84 7,12.386v20.114h-24.5c-30.603,0-55.5,24.897-55.5,55.5v80c0,15.964 6.784,30.365 17.61,40.5h-34.11c-12.958,0-23.5,10.542-23.5,23.5 0,10.336 6.71,19.128 16,22.266v67.468c-9.29,3.138-16,11.93-16,22.266v16c0,4.142 3.358,7.5 7.5,7.5s7.5-3.358 7.5-7.5v-16c0-4.687 3.813-8.5 8.5-8.5 4.687,0 8.5,3.813 8.5,8.5v16c0,4.142 3.358,7.5 7.5,7.5s7.5-3.358 7.5-7.5v-16c0-10.336-6.71-19.128-16-22.266v-66.234h33v72.5c0,12.958 10.542,23.5 23.5,23.5h9.409c1.245,5.075 3.72,9.669 7.093,13.449 0,0.017-0.003,0.034-0.003,0.051v35.5h-8.499c-21.78,0-39.5,17.72-39.5,39.5 0,4.142 3.358,7.5 7.5,7.5h88c4.142,0 7.5-3.358 7.5-7.5v-32c0-4.142-3.358-7.5-7.5-7.5h-0.5v-35.5c0-0.017-0.002-0.034-0.003-0.051 3.374-3.78 5.849-8.375 7.093-13.449h18.819c1.245,5.075 3.72,9.669 7.093,13.449 0,0.017-0.003,0.034-0.003,0.051v35.5h-0.499c-4.142,0-7.5,3.358-7.5,7.5v32c0,4.142 3.358,7.5 7.5,7.5h88c4.142,0 7.5-3.358 7.5-7.5 0-21.78-17.72-39.5-39.5-39.5h-8.5v-35.5c0-0.017-0.002-0.034-0.003-0.051 3.374-3.78 5.849-8.375 7.093-13.449h9.41c12.958,0 23.5-10.542 23.5-23.5v-72.5h33v66.234c-9.29,3.138-16,11.93-16,22.266v16c0,4.142 3.358,7.5 7.5,7.5s7.5-3.358 7.5-7.5v-16c0-4.687 3.813-8.5 8.5-8.5s8.5,3.813 8.5,8.5v16c0,4.142 3.358,7.5 7.5,7.5s7.5-3.358 7.5-7.5v-16c0-10.336-6.71-19.128-16-22.266zm-7.5-81.234c-4.687,0-8.5-3.813-8.5-8.5s3.813-8.5 8.5-8.5 8.5,3.813 8.5,8.5-3.813,8.5-8.5,8.5zm-256.5-152.5c0-22.332 18.168-40.5 40.5-40.5h144c22.332,0 40.5,18.168 40.5,40.5v48c0,8.239-16.171,16.553-30.019,21.169-21.921,7.307-51.213,11.331-82.481,11.331-31.268,0-60.561-4.024-82.481-11.331-13.848-4.616-30.019-12.93-30.019-21.169v-48zm0,80v-8.518c5.971,4.143 14.148,8.208 25.275,11.918 23.41,7.803 54.387,12.1 87.225,12.1s63.815-4.297 87.225-12.101c11.128-3.709 19.304-7.775 25.275-11.918v8.518c0,22.332-18.168,40.5-40.5,40.5h-144c-22.332,0.001-40.5-18.167-40.5-40.499zm-31.5,55.5c4.687,0 8.5,3.813 8.5,8.5s-3.813,8.5-8.5,8.5c-4.687,0-8.5-3.813-8.5-8.5s3.813-8.5 8.5-8.5zm21.903,17c1.027-2.638 1.597-5.503 1.597-8.5s-0.57-5.862-1.597-8.5h18.597v17h-18.597zm98.597,192h-71.826c3.175-9.853 12.432-17 23.326-17h48.5v17zm-25-32v-26.175c2.706,0.76 5.555,1.175 8.5,1.175s5.794-0.415 8.5-1.175v26.175h-17zm8.5-40c-6.396,0-11.942-3.666-14.679-9h29.357c-2.737,5.334-8.282,9-14.678,9zm135.326,72h-71.826v-17h48.5c10.894,0 20.151,7.147 23.326,17zm-63.826-32v-26.175c2.706,0.76 5.555,1.175 8.5,1.175s5.794-0.415 8.5-1.175v26.175h-17zm8.5-40c-6.396,0-11.942-3.666-14.679-9h29.357c-2.737,5.334-8.282,9-14.678,9zm48.5-32.5c0,4.687-3.813,8.5-8.5,8.5h-160c-4.687,0-8.5-3.813-8.5-8.5v-107.004c5.215,1.627 10.757,2.504 16.5,2.504h144c5.743,0 11.286-0.877 16.5-2.504v107.004zm15-104.5h18.597c-1.027,2.638-1.597,5.503-1.597,8.5s0.57,5.862 1.597,8.5h-18.597v-17z"/>
    <path d="m231,263c-17.369,0-31.5,14.131-31.5,31.5s14.13,31.5 31.5,31.5 31.5-14.131 31.5-31.5-14.131-31.5-31.5-31.5zm0,48c-9.098,0-16.5-7.402-16.5-16.5s7.401-16.5 16.5-16.5 16.5,7.402 16.5,16.5-7.402,16.5-16.5,16.5z"/>
    <path d="m175,271c-4.142,0-7.5,3.358-7.5,7.5v32c0,4.142 3.358,7.5 7.5,7.5s7.5-3.358 7.5-7.5v-32c0-4.142-3.358-7.5-7.5-7.5z"/>
    <path d="m287,271c-4.142,0-7.5,3.358-7.5,7.5v32c0,4.142 3.358,7.5 7.5,7.5s7.5-3.358 7.5-7.5v-32c0-4.142-3.358-7.5-7.5-7.5z"/>
  </g>
</svg>
`;

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
            <div>
              <div
                style={{
                  background: "#f6f6f6" as StyleHack,
                  padding: Spacing.FOUR,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "25px",
                    opacity: "0.5",
                  }}
                  dangerouslySetInnerHTML={{ __html: RobotSvg }}
                ></div>
                <span>
                  Summaries generated by ChatGPT. May not be accurate.
                </span>
              </div>
            </div>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <a
                      target="_blank"
                      href={link}
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {id} <FaGlobe style={{ paddingLeft: Spacing.ONE }} />
                    </a>
                    <div>{statusDate}</div>
                  </div>
                  {sponsoredByRep && (
                    <Tag
                      backgroundColor="red"
                      text={`Sponsored By Your Rep: ${sponsoredByRep}`}
                    ></Tag>
                  )}

                  <div className="text-xl font-semibold">{title}</div>
                  {gpt?.gpt_summary && (
                    <div
                      style={{
                        background: "#f6f6f6" as StyleHack,
                        padding: Spacing.FOUR,
                        borderRadius: "16px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "33px",
                          position: "absolute",
                          right: "-15px",
                          top: "-15px",
                          transform: "rotate(9deg)",
                          opacity: "0.5",
                        }}
                        dangerouslySetInnerHTML={{ __html: RobotSvg }}
                      ></div>
                      <h4 className="text-lg">{gpt.gpt_summary}</h4>
                      {gpt?.gpt_tags && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          {gpt.gpt_tags.map((v) => (
                            <div style={{ display: "inline-flex" }} key={v}>
                              <Tag text={v} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: "monospace",
                      padding: "10px 40px" as StyleHack,
                    }}
                  >
                    {description}
                  </div>
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
