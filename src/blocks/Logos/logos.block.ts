import { defineBlock } from "../defineBlock";
import Logos from "./Logos";
import { LOGOS_DEFAULTS, LOGOS_TAGS, LOGOS_VARIANTS } from "./logos.constants";
import { logosSchema } from "./logos.schema";

export const logosBlock = defineBlock({
  type: "logos",
  name: "Логотипы",
  tags: LOGOS_TAGS,
  variants: LOGOS_VARIANTS,
  schema: logosSchema,
  defaults: LOGOS_DEFAULTS,
  Component: Logos,
  codegen: () => import("./logos.codegen"),
});
