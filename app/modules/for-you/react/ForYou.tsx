import type { Env } from "~/config";
import { RepLevel } from "~/levels";
import type { StyleHack } from "~/ui";
import {
  AddressLookup,
  Col,
  Container,
  Grid,
  RadioPicker,
  Spacing,
  Tag,
  Tagging,
} from "~/ui";
import type { ForYouBill } from "../selector";

import React from "react";
import { FaGlobe } from "react-icons/fa";
import { CiviUpdates, GithubBanner, IntroContent } from "~/intro/Intro";
import type { OfficialOffice } from "~/representatives";
import { OfficialOfficeList } from "~/representatives";
import { SVG } from "~/svg-icons/RobotSvg";
import Modal from "~/ui/Modal/Modal";

export interface FilterParams {
  address?: string | null;
  tags?: string[] | null;
  level?: RepLevel | null;
}

export type UpdateFiltersFn = (p: FilterParams) => void;

interface ForYouProps {
  legislation: ForYouBill[];
  tags: string[];
  address: string | null;
  updateFilters: UpdateFiltersFn;
  offices: OfficialOffice[] | null;
  filters: FilterParams;
  env: Env;
}

export const AppShell = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  return (
    <Container>
      <GithubBanner url="https://github.com/civi-social/civi-mvp" />
      <Grid className="flex min-h-screen flex-col items-center justify-center bg-gray-300 bg-opacity-50">
        <Col
          className="via-opacity-30 flex h-full flex-col text-left"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,29,135,1) 0vh, rgba(255,82,37,1) 75vh, rgb(245 245 245 / 30%) 125vh)" as StyleHack,
          }}
        >
          <IntroContent />
          <div className="mt-5 mb-5 rounded-md bg-opacity-95 text-left">
            {left}
          </div>
          <div
            className="mt-5 mb-5 rounded-md bg-opacity-60 text-left"
            style={{ background: "#f198d170" as StyleHack }}
          >
            <CiviUpdates />
          </div>
        </Col>
        <Col>{right}</Col>
      </Grid>
    </Container>
  );
};

export const ForYou = (props: ForYouProps) => {
  const [showOfficeModal, setShowOfficeModal] = React.useState(false);

  const showOfficeComponent = (
    <>
      {props.offices && (
        <div
          style={{
            background: "#5528b817" as StyleHack,
            fontWeight: "bold",
            color: "#d22cff" as StyleHack,
            cursor: "pointer",
            padding: Spacing.FOUR,
            borderRadius: "25px",
            display: "flex",
            alignItems: "center",
            marginBottom: Spacing.TWO,
            textAlign: "center",
            textDecoration: "underline",
          }}
          onClick={() => {
            setShowOfficeModal(true);
          }}
        >
          <span>See Representatives For This Address.</span>
        </div>
      )}
    </>
  );

  return (
    <>
      {props.offices && showOfficeModal ? (
        <Modal
          isOpen={showOfficeModal}
          onClose={() => setShowOfficeModal(false)}
        >
          <div className="flex w-full max-w-2xl flex-col gap-y-5 justify-self-center">
            <div className="text-center text-lg font-light">
              Representatives for {props.address}.
            </div>
            <OfficialOfficeList officialOffice={props.offices} />
          </div>
        </Modal>
      ) : (
        <AppShell
          left={<ForYouBillFilters {...props} />}
          right={
            <ForYouBills {...props} showOfficeComponent={showOfficeComponent} />
          }
        />
      )}
    </>
  );
};

export const ForYouBillFilters = ({
  tags,
  updateFilters,
  filters,
  env,
}: ForYouProps) => {
  return (
    <div>
      <section>
        <div className="flex justify-center">
          <div className="flex w-full max-w-screen-md flex-col justify-center">
            <div className="p-4">
              <div className="rounded-lg p-4">
                <div className=" mb-4 rounded-md border-2 border-black bg-black bg-opacity-70">
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
                <div className="mt-4">
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
        </div>
      </section>
    </div>
  );
};

export const ForYouBills = ({
  legislation,
  showOfficeComponent,
}: ForYouProps & { showOfficeComponent: React.ReactNode }) => {
  return (
    <div>
      <section>
        <div className="flex justify-center">
          <div className="flex max-w-lg flex-col justify-center">
            <div>
              {showOfficeComponent}
              <div className="flex items-center rounded-xl bg-gray-100 p-4">
                <SVG.Robot
                  style={{
                    width: "25px",
                    opacity: "0.5",
                  }}
                />
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
                  className="mt-4 flex flex-col gap-y-2 border border-gray-200 bg-white px-4 py-2"
                  key={id + title}
                >
                  <div className="flex items-center justify-between">
                    <a
                      target="_blank"
                      href={link}
                      rel="noreferrer"
                      className="flex items-center"
                    >
                      {id} <FaGlobe className="pl-1" />
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
                    <div className="relative rounded-2xl bg-gray-100 px-6 pt-5 pb-2">
                      <SVG.Robot
                        style={{
                          width: "33px",
                          position: "absolute",
                          right: "-15px",
                          top: "-15px",
                          transform: "rotate(9deg)",
                          opacity: "0.5",
                        }}
                      />
                      <h4 className="text-lg">{gpt.gpt_summary}</h4>
                      {gpt?.gpt_tags && (
                        <div className="flex flex-row flex-wrap">
                          {gpt.gpt_tags.map((v) => (
                            <div className="inline-flex" key={v}>
                              <Tag text={v} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="py-4 px-10 font-mono">{description}</div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
