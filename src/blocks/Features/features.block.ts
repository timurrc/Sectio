import { codegenNotImplemented } from "../shared/codegenStub";
import { defineBlock } from "../defineBlock";
import Features from "./Features";
import { FEATURES_DEFAULTS, FEATURES_TAGS, FEATURES_VARIANTS } from "./features.constants";
import { featuresSchema } from "./features.schema";

export const featuresBlock = defineBlock({
  type: "features",
  name: "Преимущества",
  tags: FEATURES_TAGS,
  variants: FEATURES_VARIANTS,
  schema: featuresSchema,
  defaults: FEATURES_DEFAULTS,
  Component: Features,
  codegen: codegenNotImplemented("features"),
});
