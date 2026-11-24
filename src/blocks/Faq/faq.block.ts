import { defineBlock } from "../defineBlock";
import Faq from "./Faq";
import { FAQ_DEFAULTS, FAQ_TAGS, FAQ_VARIANTS } from "./faq.constants";
import { faqSchema } from "./faq.schema";

export const faqBlock = defineBlock({
  type: "faq",
  name: "Вопросы и ответы",
  tags: FAQ_TAGS,
  variants: FAQ_VARIANTS,
  schema: faqSchema,
  defaults: FAQ_DEFAULTS,
  Component: Faq,
  codegen: () => import("./faq.codegen"),
});
