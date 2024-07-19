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
import {
  OfficialOfficeList,
  RepresentativeCard,
  getLegislators,
} from "~/representatives";
import { RobotSvg } from "~/svg-icons";
import Modal from "~/ui/Modal/Modal";
import {
  RepLevel,
  SupportedLocale,
  getBillUpdateAt,
  getLocation,
  isAddressFilter,
  isCityLevel,
  isStateLevel,
} from "~app/modules/legislation/filters";
import {
  getLastStatus,
  mapToReadableStatus,
} from "~app/modules/legislation/format/format.utils";
import { Carousel } from "~app/modules/ui/Carousel/Carousel";
import { FYBFilterProps, ForYouProps } from "../foryou.types";

const YourFeedSummary = (
  props: FYBFilterProps & { setIsExploring: (b: boolean) => void }
) => {
  const legislators = getLegislators(props.offices);
  const location = props.filters.location;
  let levelText =
    props.filters.level === RepLevel.City
      ? "Local, State, & National"
      : props.filters.level === RepLevel.State
      ? "State & National"
      : props.filters.level === RepLevel.National
      ? "National"
      : "";

  let locationName = "";

  switch (location) {
    case SupportedLocale.Chicago:
      locationName = "Chicago";
      levelText = levelText || "Local, State, & National";
      break;
    case SupportedLocale.Illinois:
      locationName = "Illinois";
      levelText = levelText || "State & National";
      break;
    case SupportedLocale.USA:
      locationName = "America";
      levelText = levelText || "National";
      break;
  }

  if (isAddressFilter(location)) {
    locationName = "Chicago";
    levelText = levelText || "Local, State, & National";
  }
  if (!levelText) {
    levelText = "All";
  }

  const showSponsoredText =
    legislators?.length > 1 && !props.filters.dontShowSponsoredByReps;

  const locationText = (
    <div className="mb-1 text-left font-serif text-sm lg:text-lg">
      {locationName && (
        <div className="mb-1 inline lg:block lg:text-3xl">{locationName}! </div>
      )}
      {/* If only 1 layer, "combining" messaging doesn't make sense. */}
      {levelText === "National" ? (
        <>
          This feed is summarizing bills that impact the entire country in an an
          easy to digest way.
        </>
      ) : (
        <>
          <span className="opacity-80 ">This feed is combining </span>
          <span>{levelText}</span>
          <span className="opacity-80"> bills into a unified experience.</span>
        </>
      )}
    </div>
  );

  const legislatorToggle = legislators?.length > 1 && (
    <div className="mb-1 rounded bg-black bg-opacity-20 p-1">
      <div className="mb-1 text-xs uppercase opacity-80 lg:text-base">
        {showSponsoredText ? (
          <>Following Bills Sponsored By Your Reps</>
        ) : (
          <>Your Representatives</>
        )}
      </div>
      <div className="block lg:hidden">
        <LegislatorsToggle
          offices={props.offices}
          showAllReps={props.showAllReps}
        />
      </div>

      <div className="m-2 hidden lg:block">
        <Legislators offices={props.offices} showAllReps={props.showAllReps} />
      </div>
    </div>
  );

  const tagCloud = (
    <div className="rounded bg-black bg-opacity-20 p-1">
      <div className="mb-1 text-xs uppercase opacity-80 lg:text-base">
        Issue You Follow
      </div>
      <div className="my-1 flex flex-wrap justify-center font-sans lg:hidden lg:justify-end">
        {props.filters?.tags?.map((v) => {
          return <Tag key={v} type="tiny" text={v} />;
        })}
      </div>
      <div className="my-1 hidden flex-wrap justify-center font-sans lg:flex">
        {props.filters?.tags?.map((v) => {
          return <Tag key={v} text={v} />;
        })}
      </div>
    </div>
  );

  return (
    <div className="block rounded bg-black bg-opacity-20 p-3 text-center text-white">
      {locationText}
      <div className="lg:px-1 lg:text-right">
        <span className="inline-block rounded-sm text-xs font-bold uppercase">
          <span className="opacity-60">Preferences</span> (
          <span
            role="button"
            className="underline opacity-80"
            onClick={() => {
              props.setIsExploring(true);
            }}
          >
            Edit
          </span>
          )
        </span>
      </div>
      {legislatorToggle}
      {tagCloud}
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
          props.saveToFeed();
          props.updateGlobalState({
            noSavedFeed: false,
            showExplore: false,
          });
          setIsExploringState(false);
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
    mode = <YourFeedSummary {...props} setIsExploring={setIsExploring} />;
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
  const [showAddress, setShowAddress] = useState(
    isAddressFilter(props.filters.location)
  );

  return (
    <div>
      <section>
        <div className="mt-4 font-serif text-2xl font-semibold leading-tight text-white lg:text-right">
          {props.title}
        </div>

        <div className="flex justify-center pt-4">
          <div
            className={classNames(
              "flex w-full max-w-screen-md flex-col justify-center"
            )}
          >
            {/* Location Filter */}
            <div>
              <div className="lg:px-1 lg:text-right">
                <span className="inline-block rounded-sm text-sm font-bold uppercase text-black opacity-70">
                  Set Location
                </span>
              </div>
              <div className="flex items-end justify-end">
                <div className="flex w-full flex-col">
                  <RadioPicker
                    handleChange={(next) => {
                      if (next === false) {
                        props.updateFilters({
                          location: SupportedLocale.USA,
                        });
                      }
                      setShowAddress(next);
                    }}
                    defaultValue={showAddress}
                    optionClassName="flex-1 bg-gray-800 rounded-bl-none rounded-br-none mb-0 w-max text-sm uppercase lg:justify-center text-opacity-90 font-bold"
                    options={[
                      {
                        label: "By Locale",
                        value: false,
                        className: (isSelected) =>
                          isSelected
                            ? "bg-opacity-40"
                            : "bg-opacity-10 text-black",
                      },
                      {
                        label: "By Address",
                        value: true,
                        className: (isSelected) =>
                          isSelected
                            ? "bg-opacity-40"
                            : "bg-opacity-10 text-black",
                      },
                    ]}
                  />
                  {!showAddress && (
                    <div className="flex-1 rounded-b-md">
                      <RadioPicker
                        handleChange={(next) => {
                          props.updateFilters({
                            location: next,
                            level: null,
                          });
                          setShowAddress(false);
                        }}
                        defaultValue={props.filters.location}
                        optionClassName="flex-1 w-max rounded-tl-none rounded-tr-none shadow"
                        options={[
                          {
                            label: "Chicago",
                            value: SupportedLocale.Chicago,
                          },
                          {
                            label: "Illinois",
                            value: SupportedLocale.Illinois,
                          },
                          {
                            label: "USA",
                            value: SupportedLocale.USA,
                          },
                        ]}
                      />
                    </div>
                  )}
                  {showAddress && (
                    <div className="flex-1 rounded-b-md bg-black bg-opacity-30">
                      <div className="shadow-md lg:px-1 lg:text-right">
                        <AddressLookup
                          onClear={() => {
                            props.updateFilters({
                              location: SupportedLocale.USA,
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
                      <YourRepFilter {...props} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Tags Filter */}
            <div className="mt-4">
              <div className="lg:px-1 lg:text-right">
                <span className="inline-block rounded-sm text-sm font-bold uppercase text-black opacity-70">
                  Include Bills Tagged With
                </span>
              </div>
              <div className="rounded-lg bg-black bg-opacity-30 p-2">
                <Tagging
                  tags={props.filters.availableTags}
                  selected={props.filters.tags}
                  handleClick={(updatedTags) => {
                    props.updateFilters({
                      tags: updatedTags,
                    });
                  }}
                />
              </div>
            </div>
            {/* Save Button */}
            <div className="mt-4 flex w-full justify-center">
              <div
                role="button"
                className="rounded bg-white bg-opacity-50 px-4 py-2 text-base font-semibold text-black opacity-80 backdrop-blur hover:bg-opacity-100 lg:float-right"
                onClick={() => {
                  props.onSave();
                }}
              >
                Save Preferences To Your Feed
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const LevelFilter = (props: ForYouProps) => {
  const cityLabel = isCityLevel(props.filters.location) ? "Chicago" : "City";
  const stateLabel =
    isCityLevel(props.filters.location) || isStateLevel(props.filters.location)
      ? "Illinois"
      : "State";
  const nationalLabel = "USA";
  const levelOptions: { label: string; value: RepLevel | null }[] | null =
    isCityLevel(props.filters.location)
      ? [
          { label: "All", value: null },
          { label: cityLabel, value: RepLevel.City },
          { label: stateLabel, value: RepLevel.State },
          { label: nationalLabel, value: RepLevel.National },
        ]
      : isStateLevel(props.filters.location)
      ? [
          { label: "All", value: null },
          { label: stateLabel, value: RepLevel.State },
          { label: nationalLabel, value: RepLevel.National },
        ]
      : null;

  return (
    <>
      {levelOptions && (
        <div className="mt-4">
          <div className="bg-black bg-opacity-20 text-center lg:px-1">
            <span className="text-xs font-bold uppercase text-white opacity-80">
              Filter By
            </span>
          </div>
          <RadioPicker<RepLevel | null | undefined | "">
            handleChange={(next) => {
              if (!next) {
                props.updateFilters({
                  level: null,
                });
              } else {
                props.updateFilters({
                  level: next,
                });
              }
            }}
            optionClassName="flex-1 my-0 rounded-bl-none rounded-br-none rounded-tr-none rounded-tl-none justify-center"
            defaultValue={props.filters.level}
            options={levelOptions}
          />
        </div>
      )}
    </>
  );
};

const newBillGlow = {
  filter: "drop-shadow(0px 0px 8px rgb(59, 130, 246))",
};

export const ForYouBills = (props: ForYouProps) => {
  const lastVisited = props.globalState.lastVisited;

  // Getting the index of the first item after the last visit date, and splitting there.
  let indexOfSplit = -1;
  for (var i = 0; i < props.filteredLegislation.length; i++) {
    const billUpdatedAt = getBillUpdateAt(props.filteredLegislation[i]);
    if (billUpdatedAt <= lastVisited) {
      indexOfSplit = i;
      break;
    }
  }

  let bills: React.ReactNode;
  // No Results
  if (props.filteredLegislation.length === 0) {
    bills = <NoResults />;
    // We have a last read date
  } else if (indexOfSplit > 0) {
    const unreadList = props.filteredLegislation.slice(0, indexOfSplit);
    const readList = props.filteredLegislation.slice(indexOfSplit);
    bills = (
      <>
        <div
          style={newBillGlow}
          className="mt-4 rounded bg-blue-500 px-3 py-1 text-center text-lg font-bold uppercase"
        >
          New Updates Since Your Last Visit
        </div>
        {unreadList.map((l) => (
          <Bill key={l.bill.id + l.bill.title} {...l} glow={true} />
        ))}
        <div
          style={{ height: "40px" }}
          className="mt-4 flex items-center justify-center rounded bg-green-500 px-3 py-1 text-center text-lg font-bold uppercase"
        >
          All Caught Up
        </div>
        {readList.map((l) => (
          <Bill key={l.bill.id + l.bill.title} {...l} />
        ))}
      </>
    );
  } else {
    bills = (
      <>
        {props.filteredLegislation.map((l) => (
          <Bill key={l.bill.id + l.bill.title} {...l} />
        ))}
      </>
    );
  }

  return (
    <section>
      <div className="flex justify-center">
        <div className="flex max-w-lg flex-col justify-center">
          {props.globalState.noSavedFeed && <LLMWarning />}
          <LevelFilter {...props} />
          {bills}
        </div>
      </div>
    </section>
  );
};

const NoResults = () => (
  <div className="mt-5 w-full flex-1 rounded bg-white bg-opacity-80 p-10 font-serif text-black">
    <div className="text-xl">No Results Found.</div>
    <p>
      Try updating your preferences. Also feel free to submit a bug on our{" "}
      <a
        className="underline"
        href="https://github.com/chihacknight/breakout-groups/issues/219"
        target="_blank"
      >
        Chi Hack Night
      </a>{" "}
      channel.
    </p>
  </div>
);

const LLMWarning = () => {
  return (
    <div className="flex items-center rounded-lg bg-gray-100 bg-opacity-30 p-4 text-sm lg:text-base">
      <RobotSvg
        style={{
          width: "25px",
          opacity: "0.5",
          marginRight: "5px" as StyleHack,
        }}
      />
      <span>Summaries generated by ChatGPT. May not be accurate.</span>
    </div>
  );
};

export const Bill = ({
  bill,
  gpt,
  level,
  sponsoredByRep,
  allTags,
  glow,
}: ForYouBill & { glow?: boolean }) => {
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
  const linkTitle = level === RepLevel.City ? `${identifier}` : id;

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
  return (
    <article
      style={glow ? newBillGlow : {}}
      className={classNames(
        "mt-4 flex flex-col gap-y-2 rounded border border-gray-200 bg-white p-4"
      )}
    >
      {allTags && (
        <div className="flex flex-row flex-wrap justify-center">
          {[...new Set(allTags)].map((v) => (
            <div className="inline-flex" key={v}>
              <Tag className="text-xs" text={v} />
            </div>
          ))}
        </div>
      )}
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
      <div className="flex flex-wrap items-center justify-end">
        <a
          target="_blank"
          href={link}
          rel="noreferrer"
          className="flex items-center text-sm font-light uppercase text-slate-600"
        >
          {levelsMap[level]} {linkTitle} <FaGlobe className="pl-1" />
        </a>
      </div>
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
          <div className="px-3 pt-3">
            {left}
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

  const showAllReps = () => {
    setShowOfficeModal(true);
  };

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
          left={<Navigation {...props} showAllReps={showAllReps} />}
          right={<ForYouBills {...props} />}
        />
      )}
    </>
  );
};

const YourRepFilter = (props: FYBFilterProps) => {
  return (
    <>
      {isAddressFilter(props.filters.location) && (
        <div>
          <div className="bg-primary flex flex-col items-center justify-between py-2 px-4 text-center text-white lg:flex-row lg:text-left">
            <div className="flex-1 text-sm font-semibold lg:text-base">
              <span className="opacity-80">
                These Are Your Primary Representatives.
              </span>
              <div>Include Bills Sponsored By Them?</div>
              <RadioPicker<true | null>
                handleChange={(next) => {
                  props.updateFilters({
                    dontShowSponsoredByReps: next,
                  });
                }}
                defaultValue={props.filters.dontShowSponsoredByReps}
                containerClassName="flex justify-center lg:justify-start my-2"
                optionClassName="text-xs"
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
              />{" "}
            </div>
            <div className="flex-1 text-center lg:text-right">
              <Legislators
                offices={props.offices}
                showAllReps={props.showAllReps}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

type LegislatorsFunc = {
  offices: OfficialOffice[] | null;
  showAllReps: FYBFilterProps["showAllReps"];
};

const Legislators = ({ offices, showAllReps }: LegislatorsFunc) => {
  const [officeToShow, setShowOfficeToShow] = useState("");
  const officialOffice = offices?.find(
    (office) => getRepKey(office) === officeToShow
  );
  return (
    <>
      {getLegislators(offices).map((person) => (
        <div key={person.name} className="mb-1">
          {officialOffice && getRepKey(person) === getRepKey(officialOffice) ? (
            <div key={person.name} className="m-2">
              <RepresentativeCard {...officialOffice} />
            </div>
          ) : (
            <Legislator
              {...person}
              onClick={(key) => {
                setShowOfficeToShow(key);
              }}
            />
          )}
        </div>
      ))}
      <div
        role="button"
        className="inline-block rounded bg-opacity-50 uppercase text-white underline decoration-dotted"
        onClick={showAllReps}
      >
        See More
      </div>
    </>
  );
};

const Legislator = (
  person: ReturnType<typeof getLegislators>[0] & {
    onClick: (key: string) => void;
  }
) => {
  return (
    <span
      role="radio"
      className="cursor-pointer underline decoration-dotted hover:underline"
      onClick={() => person.onClick(getRepKey(person))}
    >
      <span className="opacity-80">{person.title}</span>{" "}
      <span className="">{person.name}</span>
    </span>
  );
};

const LegislatorsToggle = (props: LegislatorsFunc) => {
  const [showSponsorBoxMobile, setShowSponsorBoxMobile] = useState(false);

  return showSponsorBoxMobile ? (
    <div className="rounded bg-black bg-opacity-20 p-2 text-xs">
      <Legislators offices={props.offices} showAllReps={props.showAllReps} />
    </div>
  ) : (
    <div
      className="inline-block cursor-pointer rounded bg-black bg-opacity-20 px-5 py-1 text-xs underline decoration-dotted"
      onClick={() => setShowSponsorBoxMobile(true)}
    >
      See Your Representatives
    </div>
  );
};

const getRepKey = (person: {
  official: { name: string };
  office: { name: string };
}) => person.office.name + person.official.name;
