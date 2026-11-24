import { defineBlock } from "../defineBlock";
import Cta from "./Cta";
import { CTA_DEFAULTS, CTA_TAGS, CTA_VARIANTS } from "./cta.constants";
import { ctaSchema } from "./cta.schema";

export const ctaBlock = defineBlock({
  type: "cta",
  name: "Призыв к действию",
  tags: CTA_TAGS,
  variants: CTA_VARIANTS,
  schema: ctaSchema,
  defaults: CTA_DEFAULTS,
  Component: Cta,
  codegen: () => import("./cta.codegen"),
});
