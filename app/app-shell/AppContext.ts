import { createContext, useContext } from "react";
import type { Config } from "~/entities/levels";

const AppContext = createContext<Config | null>(null);

export default AppContext;

export const useAppContext = () => useContext(AppContext);
