import { defineBlock } from "../defineBlock";
import Navbar from "./Navbar";
import { NAVBAR_DEFAULTS, NAVBAR_TAGS, NAVBAR_VARIANTS } from "./navbar.constants";
import { navbarSchema } from "./navbar.schema";

export const navbarBlock = defineBlock({
  type: "navbar",
  name: "Навигация",
  tags: NAVBAR_TAGS,
  variants: NAVBAR_VARIANTS,
  schema: navbarSchema,
  defaults: NAVBAR_DEFAULTS,
  Component: Navbar,
  codegen: () => import("./navbar.codegen"),
});
