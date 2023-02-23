import type { Spacing, ZIndex, Skin } from "../modules/ui/styles";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as CSS from "csstype";

declare module "csstype" {
  interface Properties extends CSS.Properties {
    padding?: Spacing;
    paddingTop?: Spacing;
    paddingBottom?: Spacing;
    paddingRight?: Spacing;
    paddingLeft?: Spacing;
    margin?: Spacing;
    marginTop?: Spacing;
    marginBottom?: Spacing;
    marginRight?: Spacing;
    marginLeft?: Spacing;
    zIndex?: ZIndex;

    color?: Skin;
    backgroundColor?: Skin;
    background?: Skin;
  }
}
