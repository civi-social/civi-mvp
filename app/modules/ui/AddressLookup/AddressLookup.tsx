/* tslint:disable */
import { useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import Autocomplete from "react-google-autocomplete";
import { useAppContext } from "~/app-shell/AppContext";
import type { Env } from "~/config";

export const AddressLookup: FC<{ env: Env }> = ({ env }) => {
  const config = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const addressKey = env.FORMATTED_ADDRESS_SEARCH_KEY;
  const levelKey = env.REP_LEVEL_SEARCH_KEY;

  return config?.apiKey ? (
    <Autocomplete
      options={{ types: ["address"] }}
      apiKey={config.apiKey}
      placeholder="Find Your Reps By Address..."
      defaultValue={searchParams.get(addressKey) ?? ""}
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
  ) : (
    <input
      disabled
      placeholder="Loading..."
      className="w-full rounded-md bg-transparent px-2 py-1 lg:text-right"
    />
  );
};
