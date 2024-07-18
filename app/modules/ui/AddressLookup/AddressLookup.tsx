/* tslint:disable */
import { useSearchParams } from "@remix-run/react";
import { useState, type FC, useEffect } from "react";
import Autocomplete from "react-google-autocomplete";
import { useAppContext } from "~/app-shell/AppContext";
import type { Env } from "~/config";

export const AddressLookup: FC<{
  env: Env;
  onPlaceSelected: (address: string) => void;
  value?: string;
}> = ({ env, value, onPlaceSelected }) => {
  const config = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const addressKey = env.FORMATTED_ADDRESS_SEARCH_KEY;
  const levelKey = env.REP_LEVEL_SEARCH_KEY;

  return config?.apiKey ? (
    <div className="lg:text-right">
      <Autocomplete
        // Hack to force remount
        key={value || ""}
        options={{ types: ["address"] }}
        apiKey={config.apiKey}
        placeholder="Enter Address..."
        defaultValue={value}
        className="w-full rounded-md bg-transparent px-2 py-1 text-white placeholder-white outline-none lg:text-right"
        onPlaceSelected={({ formatted_address }) => {
          if (formatted_address) {
            onPlaceSelected(formatted_address);
          }
        }}
      />
      {value && (
        <button
          className="mx-1 rounded bg-black bg-opacity-30 px-2 text-xs uppercase text-white"
          onClick={() => {
            const newSearchParams = new URLSearchParams(
              searchParams.toString()
            );
            newSearchParams.delete(addressKey);
            newSearchParams.delete(levelKey);
            setSearchParams(newSearchParams);
          }}
        >
          Clear Address
        </button>
      )}
    </div>
  ) : (
    <input
      disabled
      value={value}
      placeholder="Loading..."
      className="w-full rounded-md bg-transparent px-2 py-1 lg:text-right"
    />
  );
};
