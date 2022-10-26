/* tslint:disable */
import { useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import Autocomplete from "react-google-autocomplete";
import { useAppContext } from "~/context/AppContext";
import { addressKey, levelKey } from "~/utils";

const AddressLookup: FC = () => {
  const config = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

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
