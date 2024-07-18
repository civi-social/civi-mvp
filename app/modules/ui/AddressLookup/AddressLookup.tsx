/* tslint:disable */
import { useSearchParams } from "@remix-run/react";
import { useState, type FC, useEffect } from "react";
import Autocomplete from "react-google-autocomplete";
import { useAppContext } from "~/app-shell/AppContext";
import type { Env } from "~/config";
import {
  getCookieFromString,
  setCookieInDom,
} from "~app/modules/for-you/utils";

export const AddressLookup: FC<{ env: Env; defaultAddress?: string }> = ({
  env,
  defaultAddress,
}) => {
  const config = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const addressKey = env.FORMATTED_ADDRESS_SEARCH_KEY;
  const levelKey = env.REP_LEVEL_SEARCH_KEY;

  const addressValue = searchParams.get(addressKey) || defaultAddress || "";

  return config?.apiKey ? (
    <div className="lg:text-right">
      {addressValue && (
        <div className="px-2 py-1 text-xs font-bold uppercase text-white opacity-80">
          Showing All Bills Sponsored By Legislators Of{" "}
        </div>
      )}
      <Autocomplete
        // Hack to force remount
        key={addressValue}
        options={{ types: ["address"] }}
        apiKey={config.apiKey}
        placeholder="Find Your Reps By Address..."
        defaultValue={addressValue}
        className="w-full rounded-md bg-transparent px-2 py-1 text-white placeholder-white outline-none lg:text-right"
        onPlaceSelected={({ formatted_address }) => {
          const newSearchParams = new URLSearchParams(searchParams.toString());
          if (formatted_address) {
            newSearchParams.set(addressKey, formatted_address);
          } else {
            newSearchParams.delete(addressKey);
            newSearchParams.delete(levelKey);
          }
          setSearchParams(newSearchParams);
        }}
      />
      {addressValue && (
        <button
          className="mx-1 rounded bg-black bg-opacity-30 px-2 text-xs uppercase text-white"
          onClick={() => {
            const newSearchParams = new URLSearchParams(
              searchParams.toString()
            );
            newSearchParams.delete(addressKey);
            newSearchParams.delete(levelKey);
            setSearchParams(newSearchParams);
            // setCookieInDom(document, "address", "", -1);
          }}
        >
          Clear Address
        </button>
      )}
    </div>
  ) : (
    <input
      disabled
      placeholder="Loading..."
      className="w-full rounded-md bg-transparent px-2 py-1 lg:text-right"
    />
  );
};
