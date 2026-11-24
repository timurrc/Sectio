import { codegenNotImplemented } from "../shared/codegenStub";
import { defineBlock } from "../defineBlock";
import Footer from "./Footer";
import { FOOTER_DEFAULTS, FOOTER_TAGS, FOOTER_VARIANTS } from "./footer.constants";
import { footerSchema } from "./footer.schema";

export const footerBlock = defineBlock({
  type: "footer",
  name: "Подвал",
  tags: FOOTER_TAGS,
  variants: FOOTER_VARIANTS,
  schema: footerSchema,
  defaults: FOOTER_DEFAULTS,
  Component: Footer,
  codegen: codegenNotImplemented("footer"),
});
