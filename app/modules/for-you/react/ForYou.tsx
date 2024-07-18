import type { StyleHack } from "~/ui";
import {
  AddressLookup,
  Container,
  Grid,
  RadioPicker,
  Tag,
  Tagging,
  classNames,
  getRadioStyle,
} from "~/ui";
import type { ForYouBill } from "../../legislation/filters";

import React, { useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { CiviUpdates, Logo } from "~/intro/Intro";
import type { OfficialOffice } from "~/representatives";
import { OfficialOfficeList, getLegislators } from "~/representatives";
import { RobotSvg } from "~/svg-icons";
import Modal from "~/ui/Modal/Modal";
import { useDemoContent } from "~app/modules/demos/Demos";
import {
  RepLevel,
  SupportedLocale,
  getLocation,
  hasTags,
  isAddressFilter,
  isCityLevel,
  isNotCustomLocation,
  isNullish,
  isStateLevel,
  isSupportedLocale,
} from "~app/modules/legislation/filters";
import {
  getLastStatus,
  mapToReadableStatus,
} from "~app/modules/legislation/format/format.utils";
import { Carousel } from "~app/modules/ui/Carousel/Carousel";
import { FYBFilterProps, ForYouLoaderData, ForYouProps } from "../foryou.types";

const YourFeedSummary = (props: FYBFilterProps) => {
  const legislators = getLegislators(props.offices);
  const location = props.filters.location;
  let levelText =
    props.filters.level === RepLevel.City
      ? "city, state, & federal"
      : props.filters.level === RepLevel.State
      ? "state & federal"
      : props.filters.level === RepLevel.National
      ? "federal"
      : "";

  let locationName = "";

  switch (location) {
    case SupportedLocale.Chicago:
      locationName = "Chicago";
      levelText = levelText || "city, state, & federal";
      break;
    case SupportedLocale.Illinois:
      locationName = "Illinois";
      levelText = levelText || "state & federal";
      break;
    case SupportedLocale.USA:
      locationName = "America";
      levelText = levelText || "National";
      break;
  }
  if (isAddressFilter(location)) {
    locationName = "Chicago";
    levelText = levelText || "city, state, & federal";
  }
  if (!levelText) {
    levelText = "All";
  }

  const showSponsoredText =
    legislators && !props.filters.dontShowSponsoredByReps;

  return (
    <div className="flex flex-col lg:mt-5">
      <div className="rounded bg-black bg-opacity-30 p-3 text-center font-serif leading-tight text-white lg:text-right">
        {/* Location Info */}
        <div className="text-xl lg:text-2xl">
          <span className="opacity-80">Hello</span>
          {locationName && ` ${locationName}`}!
        </div>
        {/* Sponsored Info */}
        {showSponsoredText && (
          <>
            <div className="mt-2 text-lg">
              <span className="opacity-80">Showing any bills </span>
              <span className="opacity-100">sponsored by your reps:</span>{" "}
            </div>
            <div className="text-sm lg:text-base">
              <ul>
                {legislators.map((person, i) => {
                  const isLast = i === legislators.length - 1;
                  return (
                    <li key={person.name} className="inline lg:block">
                      <span className="opacity-80">{person.title}</span>{" "}
                      <a
                        className="cursor-pointer decoration-dotted hover:underline"
                        href={person.link}
                        target="_blank"
                      >
                        {person.name}
                        <span className="lg:hidden">{isLast ? "." : ", "}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
        {/* Tags Info */}
        {hasTags(props.filters.tags) && (
          <>
            <div className="mt-2 text-lg opacity-80">
              {showSponsoredText ? "Also showing" : "Showing"} bills tagged with
            </div>{" "}
            {props.filters?.tags?.map((v, i, arr) => {
              const isLast = i === arr.length - 1;
              return (
                <span>
                  {isLast ? "& " : ""}
                  {v}
                  {!isLast ? ", " : "."}
                </span>
              );
            })}
          </>
        )}
        {/* Levels Info */}
        <div className="mt-2 text-lg">
          <span className="opacity-80">Filtering bills at </span>
          <span>{levelText}</span>
          <span className="opacity-80"> level.</span>
        </div>
      </div>
    </div>
  );
};

const Navigation = (props: FYBFilterProps) => {
  const shouldShowExplore =
    props.globalState.noSavedFeed || props.globalState.showExplore;

  const hideNav = props.globalState.noSavedFeed;

  const [exploring, setIsExploringState] = useState(shouldShowExplore);
  const setIsExploring = (next: boolean) => {
    props.updateGlobalState({
      showExplore: next,
    });
    setIsExploringState(next);
  };

  let mode: React.ReactNode;

  if (exploring) {
    mode = (
      <BillFilters
        onSave={() => {
          setIsExploring(false);
        }}
        {...props}
        title={
          hideNav
            ? "We Want To Help You Engage With The Legislation That Impacts You"
            : "Explore Legislation"
        }
      />
    );
  } else {
    mode = <YourFeedSummary {...props} />;
  }
  return (
    <div>
      <div className="mb-2 flex items-center">
        <div className="flex-1">
          <Logo />
        </div>
        <div className={classNames(hideNav && "hidden")}>
          <RadioPicker
            key={String(exploring)}
            type="transparent"
            handleChange={(next) => {
              setIsExploring(next);
            }}
            defaultValue={exploring}
            options={[
              { label: "Your Feed", value: false },
              { label: "Explore", value: true },
            ]}
          />
        </div>

        <div className="flex-1 text-right">
          <a
            className={getRadioStyle("transparent", false, "last")}
            href="https://windycivi.com"
          >
            About
          </a>
        </div>
      </div>
      {mode}
    </div>
  );
};

export const BillFilters = (
  props: FYBFilterProps & { title: string; onSave: () => void }
) => {
  const isProbablyAddress =
    !isNotCustomLocation(props.filters.location) &&
    !isNullish(props.filters.location);

  const [showAddress, setShowAddress] = useState(isProbablyAddress);

  const levelOptions: { label: string; value: RepLevel | null }[] | null =
    isCityLevel(props.filters.location)
      ? [
          { label: "All", value: null },
          { label: "City", value: RepLevel.City },
          { label: "State", value: RepLevel.State },
          { label: "National", value: RepLevel.National },
        ]
      : isStateLevel(props.filters.location)
      ? [
          { label: "All", value: null },
          { label: "State", value: RepLevel.State },
          { label: "National", value: RepLevel.National },
        ]
      : null;

  return (
    <div>
      <section>
        <div className="mt-4 font-serif text-2xl font-semibold leading-tight text-white lg:text-right">
          {props.title}
        </div>

        <div className="flex justify-center">
          <div className="flex w-full max-w-screen-md flex-col justify-center">
            <div className="rounded-lg pt-4">
              <div className="lg:px-1 lg:text-right">
                <span className="inline-block rounded-sm text-sm font-bold uppercase text-black opacity-70">
                  Set Location
                </span>
              </div>
              <div className="flex flex-col">
                <RadioPicker<SupportedLocale>
                  handleChange={(next) => {
                    if (!next) {
                      props.updateFilters({
                        ...props.filters,
                        location: null,
                        level: null,
                      });
                    } else if (next === "Custom") {
                      setShowAddress(true);
                      props.updateFilters({
                        ...props.filters,
                        location: next,
                        level: null,
                      });
                    } else {
                      setShowAddress(false);
                      props.updateFilters({
                        ...props.filters,
                        location: next,
                        level: null,
                      });
                    }
                  }}
                  defaultValue={
                    isSupportedLocale(props.filters.location)
                      ? props.filters.location
                      : SupportedLocale.Custom
                  }
                  optionClassName={
                    showAddress && "rounded-bl-none rounded-br-none mb-0"
                  }
                  options={[
                    {
                      label: "🏠 Custom",
                      value: SupportedLocale.Custom,
                      className: (isSelected) => (isSelected ? "flex-1" : ""),
                    },
                    { label: "Chicago", value: SupportedLocale.Chicago },
                    { label: "Illinois", value: SupportedLocale.Illinois },
                    { label: "USA", value: SupportedLocale.USA },
                  ]}
                />
                {showAddress && (
                  <div className="mb-4 flex-1 rounded-b-md bg-black bg-opacity-50">
                    <div className="lg:px-1 lg:text-right">
                      <AddressLookup
                        onClear={() => {
                          props.updateFilters({
                            ...props.filters,
                            location: SupportedLocale.Custom,
                          });
                        }}
                        onPlaceSelected={(address) => {
                          if (!address.includes("Chicago, IL")) {
                            alert(
                              "Only Chicago custom addresses are supported at the moment."
                            );
                            return;
                          }
                          props.updateFilters({
                            ...props.filters,
                            location: { address },
                          });
                        }}
                        value={
                          isAddressFilter(props.filters.location)
                            ? props.filters.location.address
                            : ""
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {isAddressFilter(props.filters.location) && (
              <div className="my-4 justify-end">
                <div className="lg:px-1 lg:text-right">
                  <span className="inline-block rounded-sm text-sm font-bold uppercase text-black opacity-70">
                    Follow Sponsored Bills
                  </span>
                </div>
                <RadioPicker<true | null>
                  handleChange={(next) => {
                    props.updateFilters({
                      ...props.filters,
                      dontShowSponsoredByReps: next,
                    });
                  }}
                  defaultValue={props.filters.dontShowSponsoredByReps}
                  optionClassName="rounded-bl-none rounded-br-none mb-0 flex-1"
                  options={[
                    {
                      label: "Yes",
                      value: null,
                    },
                    {
                      label: "No",
                      value: true,
                    },
                  ]}
                />
                <div className=" bg-primary rounded-lg rounded-t-none bg-black bg-opacity-50 py-2 px-4 text-center text-white shadow-md lg:text-right">
                  <span className="inline-block text-xs font-semibold uppercase opacity-80">
                    {props.filters.dontShowSponsoredByReps
                      ? "Not Showing Bills Sponsored By Representatives Of This Address"
                      : "Showing Bills Sponsored By These Representatives"}
                  </span>
                  {!props.filters.dontShowSponsoredByReps && (
                    <div className="text-sm opacity-80">
                      <Legislators offices={props.offices} />
                    </div>
                  )}
                  {props.showAllOfficesButton}
                </div>
              </div>
            )}
            <div className="my-4">
              <div className="lg:px-1 lg:text-right">
                <span className="inline-block rounded-sm text-sm font-bold uppercase text-black opacity-70">
                  Follow Bills Tagged With
                </span>
              </div>
              <div className="rounded-lg bg-black bg-opacity-30 p-2">
                <Tagging
                  tags={props.filters.availableTags}
                  selected={props.filters.tags}
                  handleClick={(updatedTags) => {
                    props.updateFilters({
                      ...props.filters,
                      tags: updatedTags,
                    });
                  }}
                />
              </div>
            </div>

            {levelOptions && (
              <>
                <div className="lg:px-1 lg:text-right">
                  <span className="inline-block rounded-sm text-sm font-bold uppercase text-black opacity-70">
                    Only Show Bills From
                  </span>
                </div>
                <RadioPicker<RepLevel | null | undefined | "">
                  handleChange={(next) => {
                    if (!next) {
                      props.updateFilters({
                        ...props.filters,
                        level: null,
                      });
                    } else {
                      props.updateFilters({
                        ...props.filters,
                        level: next,
                      });
                    }
                  }}
                  defaultValue={props.filters.level}
                  options={levelOptions}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex w-full justify-center">
          <button
            className="mt-5 rounded-full bg-pink-500 px-4 py-2 text-base font-semibold text-white shadow lg:float-right"
            onClick={() => {
              props.saveToFeed();
              props.updateGlobalState({
                noSavedFeed: false,
                showExplore: false,
              });
              props.onSave();
            }}
          >
            Save Preferences To Your Feed
          </button>
        </div>
      </section>
    </div>
  );
};

export const ForYouBills = ({ filteredLegislation }: ForYouLoaderData) => {
  const { demoWarnComponent } = useDemoContent();
  return (
    <section>
      <div className="flex justify-center">
        <div className="flex max-w-lg flex-col justify-center">
          <div>
            <div className="flex items-center rounded-xl bg-gray-100 p-4">
              <RobotSvg
                style={{
                  width: "25px",
                  opacity: "0.5",
                  marginRight: "5px" as StyleHack,
                }}
              />
              <span>Summaries generated by ChatGPT. May not be accurate.</span>
            </div>
            {demoWarnComponent}
          </div>
          {filteredLegislation.map((l) => (
            <Bill key={l.bill.id + l.bill.title} {...l} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const Bill = ({
  bill,
  gpt,
  level,
  sponsoredByRep,
  allTags,
}: ForYouBill) => {
  const levelsMap: Record<RepLevel, string> = {
    [RepLevel.City]: "Chicago",
    [RepLevel.State]: "IL",
    [RepLevel.County]: "Cook County",
    [RepLevel.National]: "USA",
  };
  const {
    classification,
    identifier,
    id,
    title,
    status,
    link,
    description,
    updated_at,
    statusDate,
  } = bill;
  const date = updated_at || statusDate;

  const lastStatus = getLastStatus(status);
  const readableStatus = mapToReadableStatus(level, lastStatus);
  const linkTitle =
    level === RepLevel.City ? `${classification} ${identifier}` : id;

  const summaries = [
    {
      title: "AI Summary",
      content: gpt?.gpt_summary && (
        <div className="relative px-3">
          <RobotSvg
            style={{
              width: "33px",
              position: "absolute",
              right: "-15px",
              top: "-15px",
              transform: "rotate(9deg)",
              opacity: "0.5",
            }}
          />
          <h4 className="font-mono text-sm">{gpt.gpt_summary}</h4>
        </div>
      ),
    },
    {
      title: "Official Summary",
      content: description && description,
    },
  ].filter((c) => c.content);
  sponsoredByRep && console.log(sponsoredByRep);
  return (
    <article className="mt-4 flex flex-col gap-y-2 rounded border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between">
        {allTags && (
          <div className="flex flex-row flex-wrap">
            {[...new Set(allTags)].map((v) => (
              <div className="inline-flex" key={v}>
                <Tag className="text-xs" text={v} />
              </div>
            ))}
          </div>
        )}
        <a
          target="_blank"
          href={link}
          rel="noreferrer"
          className="flex items-center text-sm font-light uppercase text-slate-600"
        >
          {levelsMap[level]} {linkTitle} <FaGlobe className="pl-1" />
        </a>
      </div>
      <div className="font-serif text-lg">{title}</div>
      <div className="text-center">
        <a
          target="_blank"
          href={link}
          className={classNames(
            "inline-block rounded px-2 text-sm uppercase",
            readableStatus.type === "pass" && "bg-green-200",
            readableStatus.type === "in-progress" && "bg-blue-200",
            readableStatus.type === "fail" && "bg-red-200"
          )}
        >
          {readableStatus.name} {date}
        </a>
      </div>
      {summaries.length > 0 && <Carousel data={summaries} />}
      {sponsoredByRep && (
        <div className="text-center text-xs uppercase">
          {" "}
          Sponsored By Your Rep: {sponsoredByRep}
        </div>
      )}
    </article>
  );
};

export const ForYouShell = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  const skipToContentId = "main-content";
  return (
    <Container>
      <a
        className="bg-primary absolute left-0 z-10 m-3 -translate-y-16 p-3 text-primary-content transition focus:translate-y-0"
        href={`#${skipToContentId}`}
      >
        Skip To Content
      </a>
      {/* <GithubBanner url="https://github.com/civi-social/civi-mvp" /> */}
      <Grid
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,29,135,1) 0px, rgba(255,82,37,1) 600px, rgba(238,145, 126,1) 1000px, rgba(0,0,0,0.1) 1500px)" as StyleHack,
        }}
        className="flex min-h-screen flex-col items-center justify-center bg-gray-300 bg-opacity-50"
      >
        <aside className="via-opacity-30 flex h-full flex-col text-left">
          <div className="px-5 pt-5">
            <div className="mb-5 rounded-md bg-opacity-95 text-left">
              {left}
            </div>
            <CiviUpdates />
          </div>
        </aside>
        <main id={skipToContentId} className="h-full">
          <div className="mx-3 lg:my-5 ">{right}</div>
        </main>
      </Grid>
    </Container>
  );
};

export const ForYou = (props: ForYouProps) => {
  const [showOfficeModal, setShowOfficeModal] = React.useState(false);
  const showAllOfficesButton = (
    <>
      {props.offices && (
        <>
          <span
            className="cursor-pointer text-xs font-bold uppercase underline"
            onClick={() => {
              setShowOfficeModal(true);
            }}
          >
            See All Representatives For This Address
          </span>
        </>
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
              Representatives for {getLocation(props.filters.location)}.
            </div>
            <OfficialOfficeList officialOffice={props.offices} />
          </div>
        </Modal>
      ) : (
        <ForYouShell
          left={
            <Navigation
              {...props}
              showAllOfficesButton={showAllOfficesButton}
            />
          }
          right={<ForYouBills {...props} />}
        />
      )}
    </>
  );
};

const Legislators = ({ offices }: { offices: OfficialOffice[] | null }) => {
  return (
    <>
      {getLegislators(offices).map((person) => (
        <div key={person.name}>
          {person.title}
          {` `}
          {person.name}
        </div>
      ))}
    </>
  );
};
