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
} from "~app/modules/design-system";
import { FYBFilterProps, FeedProps } from "../feed-ui.types";
import { Legislators } from "./Representatives";

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

export const BillFilters = (
  props: FYBFilterProps & { title: string; onSave: () => void }
) => {
  const [showAddress, setShowAddress] = useState(
    isAddressFilter(props.filters.location)
  );

  return (
    <div>
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
            <div>
              <div className="flex items-end justify-end">
                <div className="flex w-full flex-col">
                  <RadioPicker
                    type="transparent"
                    handleChange={(next) => {
                      if (next === false) {
                        props.updateFilters({
                          location: SupportedLocale.USA,
                        });
                      }
                      setShowAddress(next);
                    }}
                    before={
                      <div className="my-1 flex flex-1 items-center py-2 px-2">
                        <span className="inline-block rounded-sm text-sm font-bold uppercase text-black opacity-70">
                          Set Location{" "}
                        </span>
                      </div>
                    }
                    defaultValue={showAddress}
                    containerClassName="justify-center flex"
                    optionClassName="border-none rounded-bl-none rounded-br-none mb-0 w-max text-sm uppercase lg:justify-center text-opacity-90 font-bold"
                    options={[
                      {
                        label: "By Locale",
                        value: false,
                        className: (isSelected) =>
                          isSelected ? "opacity-80 underline" : "opacity-60",
                      },
                      {
                        label: "By Address",
                        value: true,
                        className: (isSelected) =>
                          isSelected ? "opacity-80 underline" : "opacity-60",
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
                        containerClassName="justify-end flex flex-row gap-2 mt-2"
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
                  )}
                  {showAddress && (
                    <div className="flex-1 rounded-md bg-black bg-opacity-30 py-2 shadow-md">
                      <div className="pb-1 shadow-md lg:px-1 lg:text-right">
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
