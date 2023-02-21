/* tslint:disable */
import { useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import Autocomplete from "react-google-autocomplete";
import { useAppContext } from "~/modules/app-shell/AppContext";
import type { Env } from "~/config";

const AddressLookup: FC<{ env: Env }> = ({ env }) => {
  const config = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const addressKey = env.FORMATTED_ADDRESS_SEARCH_KEY;
  const levelKey = env.REP_LEVEL_SEARCH_KEY;

  return config?.apiKey ? (
    <Autocomplete
      // @ts-ignore
      autoFocus
      options={{ types: ["address"] }}
      apiKey={config.apiKey}
      placeholder="Type In Your Address Here..."
      defaultValue={searchParams.get(addressKey) ?? ""}
      className="w-80 rounded-md bg-transparent px-2 py-1 text-white outline-none"
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
      placeholder="Google API Key is not provided"
      className="rounded-md bg-transparent px-2 py-1"
    />
  );
};

export default AddressLookup;
