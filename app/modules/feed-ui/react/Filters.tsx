import { useState } from "react";
import {
  isAddressFilter,
  SupportedLocale,
  isCityLevel,
  isStateLevel,
  RepLevel,
} from "~app/modules/data/legislation";
import {
  RadioPicker,
  classNames,
  AddressLookup,
  Tagging,
  Tag,
} from "~app/modules/design-system";
import { FeedFilterProps, FeedProps } from "../feed-ui.types";
import { Legislators, LegislatorsToggle } from "./Representatives";
import { getLegislators } from "~app/modules/data/representatives";

const YourRepFilter = (props: FeedFilterProps) => {
  return (
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
        <Legislators offices={props.offices} showAllReps={props.showAllReps} />
      </div>
    </div>
  );
};

export const BillFilters = (
  props: FeedFilterProps & { title: string; onSave: () => void }
) => {
  return (
    <section>
      <div className="mt-4 font-serif text-2xl font-semibold leading-tight text-white lg:text-left">
        {props.title}
      </div>

      <div className="flex justify-center pt-4">
        <div
          className={classNames(
            "flex w-full max-w-screen-md flex-col justify-center"
          )}
        >
          {/* Location Filter */}
          <FilterContainer title="Set Location">
            <LocationFilter {...props} />
          </FilterContainer>
          {/* Tags Filter */}
          <FilterContainer title="Include Bills Tagged With">
            <Tagging
              tags={props.filters.availableTags}
              selected={props.filters.tags}
              handleClick={(updatedTags) => {
                props.updateFilters({
                  tags: updatedTags,
                });
              }}
            />
          </FilterContainer>
          {/* Save Button */}
          <div className="mt-4 flex w-full justify-center">
            <div
              role="button"
              className="rounded bg-green-600 px-4 py-2 text-base font-semibold text-white mix-blend-difference backdrop-blur hover:bg-opacity-100 lg:float-right"
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
  );
};

const FilterContainer: React.FC<{ title: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="mt-4">
      <div className="lg:px-1 lg:text-right">
        <span className="inline-block rounded-sm text-sm font-bold uppercase text-black opacity-70">
          {title}
        </span>
      </div>
      <div className="rounded-lg bg-black bg-opacity-30 p-2">{children}</div>
    </div>
  );
};

const LocationFilter = (props: FeedFilterProps) => {
  const addressSelected = isAddressFilter(props.filters.location);

  return (
    <div className="flex w-full flex-col">
      <div
        className={classNames(
          "flex-1 rounded-md bg-black bg-opacity-30 shadow-md",
          addressSelected && "py-2"
        )}
      >
        <div className="lg:text-right">
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
        {addressSelected && <YourRepFilter {...props} />}
      </div>
      <OrDivider />
      <div className="flex-1 rounded-b-md">
        <RadioPicker
          handleChange={(next) => {
            props.updateFilters({
              location: next,
              level: null,
            });
          }}
          containerClassName="justify-end flex flex-row gap-2"
          defaultValue={props.filters.location}
          optionClassName="flex-1 w-max rounded shadow"
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
    </div>
  );
};

const OrDivider = () => {
  return (
    <div className="flex items-center gap-2 opacity-50">
      <hr className="flex-1 border-dashed border-black" />
      <div>or</div>
      <hr className="flex-1 border-dashed border-black" />
    </div>
  );
};

export const LevelFilter = (props: FeedProps) => {
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

export const YourFilterSummary = (
  props: FeedFilterProps & { setIsExploring: (b: boolean) => void }
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
