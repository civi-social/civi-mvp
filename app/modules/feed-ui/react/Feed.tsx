import type { StyleHack } from "~app/modules/design-system";
import {
  Container,
  Grid,
  RadioPicker,
  Tag,
  classNames,
  getRadioStyle,
} from "~app/modules/design-system";

import React, { useState } from "react";
import {
  RepLevel,
  SupportedLocale,
  getLocation,
  isAddressFilter,
} from "~app/modules/data/legislation/filters";
import { getLegislators } from "~app/modules/data/representatives";
import Modal from "~app/modules/design-system/Modal/Modal";
import { CiviUpdates, Logo } from "~app/modules/feed-ui/react/Intro";
import type { FYBFilterProps, FeedProps } from "../feed-ui.types";
import { FeedBills } from "./Bills";
import { BillFilters } from "./Filters";
import {
  Legislators,
  LegislatorsToggle,
  RepresentativesList,
} from "./Representatives";

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

const FeedShell = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  const skipToContentId = "main-content";
  return (
    <Container className="select-none">
      <a
        className="bg-primary text-primary-content absolute left-0 z-10 m-3 -translate-y-16 p-3 transition focus:translate-y-0"
        href={`#${skipToContentId}`}
      >
        Skip To Content
      </a>
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

export const Feed = (props: FeedProps) => {
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
            <RepresentativesList officialOffice={props.offices} />
          </div>
        </Modal>
      ) : (
        <FeedShell
          left={<Navigation {...props} showAllReps={showAllReps} />}
          right={<FeedBills {...props} />}
        />
      )}
    </>
  );
};
