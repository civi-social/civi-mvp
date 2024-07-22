import React, { useState } from "react";
import { getLocation } from "~app/modules/data/filters";
import type { StyleHack } from "~app/modules/design-system";
import {
  Container,
  Grid,
  Modal,
  RadioPicker,
  classNames,
  getRadioStyle,
} from "~app/modules/design-system";
import type { FeedFilterProps, FeedProps } from "../feed-ui.types";
import { FeedBills } from "./Bills";
import { BillFilters, YourFilterSummary } from "./Filters";
import { CiviUpdates, Logo } from "./Intro";
import { RepresentativesList } from "./Representatives";

const Navigation = (props: FeedFilterProps) => {
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
    mode = <YourFilterSummary {...props} setIsExploring={setIsExploring} />;
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
          <div className="mx-3">{right}</div>
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
