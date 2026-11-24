import { defineBlock } from "../defineBlock";
import Testimonials from "./Testimonials";
import {
  TESTIMONIALS_DEFAULTS,
  TESTIMONIALS_TAGS,
  TESTIMONIALS_VARIANTS,
} from "./testimonials.constants";
import { testimonialsSchema } from "./testimonials.schema";

export const testimonialsBlock = defineBlock({
  type: "testimonials",
  name: "Отзывы",
  tags: TESTIMONIALS_TAGS,
  variants: TESTIMONIALS_VARIANTS,
  schema: testimonialsSchema,
  defaults: TESTIMONIALS_DEFAULTS,
  Component: Testimonials,
  codegen: () => import("./testimonials.codegen"),
});
