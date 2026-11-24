import { type AnyBlockDefinition, BLOCKS } from "@/blocks/registry";
import type { ISection } from "@/types/document.types";

export interface IResolvedSection {
  block: AnyBlockDefinition;
  /** Props после safeParse; при ошибке — defaults блока */
  props: unknown;
  /** Известный блоку вариант; неизвестный заменяется первым */
  variant: string;
  isValid: boolean;
}

/**
 * Секция → то, что рисуется. Одна функция для превью и кодогенерации,
 * чтобы экспорт показывал ровно то же, что видно на холсте.
 */
export const resolveSection = (section: ISection): IResolvedSection | null => {
  const block = BLOCKS[section.type];
  if (!block) return null;

  const parsed = block.schema.safeParse(section.props);
  const variant = block.variants.some((item) => item.id === section.variant)
    ? section.variant
    : block.variants[0].id;

  return {
    block,
    props: parsed.success ? parsed.data : block.defaults,
    variant,
    isValid: parsed.success,
  };
};
