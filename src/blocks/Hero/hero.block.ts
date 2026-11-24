import { codegenNotImplemented } from "../shared/codegenStub";
import { defineBlock } from "../defineBlock";
import Hero from "./Hero";
import { HERO_DEFAULTS, HERO_TAGS, HERO_VARIANTS } from "./hero.constants";
import { heroSchema } from "./hero.schema";

export const heroBlock = defineBlock({
  type: "hero",
  name: "Главный экран",
  tags: HERO_TAGS,
  variants: HERO_VARIANTS,
  schema: heroSchema,
  defaults: HERO_DEFAULTS,
  Component: Hero,
  codegen: codegenNotImplemented("hero"),
});
