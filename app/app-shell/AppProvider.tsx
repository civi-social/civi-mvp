import type { FC } from "react";
import { useEffect } from "react";
import { useState } from "react";
import type { Config } from "~/entities/levels";
import AppContext from "./AppContext";

const AppProvider: FC<{ value: Config }> = ({ children, value }) => {
  const [config, setConfig] = useState<Config | null>(null);
  useEffect(() => {
    if (value && !config) {
      setConfig(value);
    }
  }, [config, value]);

  return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};

export default AppProvider;
