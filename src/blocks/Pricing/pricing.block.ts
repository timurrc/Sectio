import { codegenNotImplemented } from "../shared/codegenStub";
import { defineBlock } from "../defineBlock";
import Pricing from "./Pricing";
import { PRICING_DEFAULTS, PRICING_TAGS, PRICING_VARIANTS } from "./pricing.constants";
import { pricingSchema } from "./pricing.schema";

export const pricingBlock = defineBlock({
  type: "pricing",
  name: "Тарифы",
  tags: PRICING_TAGS,
  variants: PRICING_VARIANTS,
  schema: pricingSchema,
  defaults: PRICING_DEFAULTS,
  Component: Pricing,
  codegen: codegenNotImplemented("pricing"),
});
