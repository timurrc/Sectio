import type { BlockType } from "@/types/document.types";
import { type AnyBlockDefinition, defineBlock } from "./defineBlock";
import { ctaBlock } from "./Cta/cta.block";
import { featuresBlock } from "./Features/features.block";
import { footerBlock } from "./Footer/footer.block";
import { heroBlock } from "./Hero/hero.block";
import { pricingBlock } from "./Pricing/pricing.block";

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
  heroBlock,
  featuresBlock,
  pricingBlock,
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
