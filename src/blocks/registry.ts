import type { BlockType } from "@/types/document.types";
import { type AnyBlockDefinition, defineBlock } from "./defineBlock";
import { ctaBlock } from "./Cta/cta.block";
import { faqBlock } from "./Faq/faq.block";
import { featuresBlock } from "./Features/features.block";
import { footerBlock } from "./Footer/footer.block";
import { heroBlock } from "./Hero/hero.block";
import { logosBlock } from "./Logos/logos.block";
import { navbarBlock } from "./Navbar/navbar.block";
import { pricingBlock } from "./Pricing/pricing.block";
import { testimonialsBlock } from "./Testimonials/testimonials.block";

export { defineBlock };
export type {
  AnyBlockDefinition,
  IBlockComponentProps,
  IBlockDefinition,
  IBlockVariant,
} from "./defineBlock";

/**
 * Регистрация блока: импортируй его модуль и добавь в список.
 * Больше нигде ничего добавлять не нужно.
 */
const BLOCK_LIST: AnyBlockDefinition[] = [
  navbarBlock,
  heroBlock,
  logosBlock,
  featuresBlock,
  testimonialsBlock,
  pricingBlock,
  faqBlock,
  ctaBlock,
  footerBlock,
];

export const BLOCKS: Partial<Record<BlockType, AnyBlockDefinition>> = Object.fromEntries(
  BLOCK_LIST.map((block) => [block.type, block]),
);

export const getBlock = (type: BlockType): AnyBlockDefinition => {
  const block = BLOCKS[type];
  if (!block) throw new Error(`Блок "${type}" не зарегистрирован`);
  return block;
};
