import { CSSProperties } from "react";

export interface CSSPropertiesWithVars extends CSSProperties {
  "--num-main-cal-rows"?: number;
}
