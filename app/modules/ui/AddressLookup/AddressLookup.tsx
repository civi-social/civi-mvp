/* tslint:disable */
import { useSearchParams } from "@remix-run/react";
import { useState, type FC, useEffect } from "react";
import Autocomplete from "react-google-autocomplete";
import { useAppContext } from "~/app-shell/AppContext";
import type { Env } from "~/config";

export const AddressLookup: FC<{
  onPlaceSelected: (address: string) => void;
  onClear: () => void;
  value?: string;
}> = ({ value, onPlaceSelected, onClear }) => {
  const config = useAppContext();

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
          className="mx-1 mb-2 rounded bg-black bg-opacity-30 px-2 text-xs uppercase text-white"
          onClick={() => {
            onClear();
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
