import { MediaQueries } from "./enums";
import type { Style } from "./types";

export const createStyleSheet = <
  T extends { [P in keyof T]: Style.Properties }
>(
  s: T
): T => {
  return s;
};

export const matchMedia = (m: MediaQueries): boolean => {
  if (typeof document !== "undefined") {
    return window?.matchMedia(m).matches;
  } else {
    return false;
  }
};

export const isDesktop = () => {
  return matchMedia(MediaQueries.md);
};

export const responsiveFlexDirection = () =>
  isDesktop() ? styles.flexDirRow : styles.flexDirCol;

const styles = createStyleSheet({
  flexDirCol: {
    flexDirection: "column",
  },
  flexDirRow: {
    flexDirection: "row",
  },
});
