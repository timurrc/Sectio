import { nanoid } from "nanoid";
import { getBlock } from "@/blocks/registry";
import { DEFAULT_THEME_DARK, DEFAULT_THEME_LIGHT } from "@/constants/theme";
import type { BlockType, IDocument, ISection, SectionTheme } from "@/types/document.types";

export const createDocument = (title = "Новый лендинг"): IDocument => ({
  id: nanoid(10),
  meta: { title, description: "" },
  theme: { light: { ...DEFAULT_THEME_LIGHT }, dark: { ...DEFAULT_THEME_DARK } },
  sections: [],
  updatedAt: Date.now(),
});

interface CreateSectionOptions {
  variant?: string;
  theme?: SectionTheme;
}

/** Секция с defaults блока. Первый вариант берётся, если вариант не указан */
export const createSection = (
  type: BlockType,
  { variant, theme = "light" }: CreateSectionOptions = {},
): ISection => {
  const block = getBlock(type);
  return {
    id: nanoid(10),
    type,
    variant: variant ?? block.variants[0].id,
    theme,
    props: structuredClone(block.defaults),
  };
};
