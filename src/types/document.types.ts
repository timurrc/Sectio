/** Все типы блоков, которые знает редактор. Реализации — в src/blocks/<Name>. */
export type BlockType =
  "navbar" | "hero" | "logos" | "features" | "testimonials" | "pricing" | "faq" | "cta" | "footer";

export type SectionTheme = "light" | "dark";

export interface IThemeTokens {
  primary: string;
  primaryHover: string;
  text: string;
  muted: string;
  bg: string;
  surface: string;
  border: string;
  radius: string;
  font: string;
}

export interface ISection<T = unknown> {
  /** nanoid */
  id: string;
  type: BlockType;
  /** Вариант раскладки блока */
  variant: string;
  theme: SectionTheme;
  /** Только данные; валидируются zod-схемой блока */
  props: T;
}

export interface IDocumentMeta {
  title: string;
  description: string;
}

/** Единственный источник правды: превью, код и экспорт только читают эту модель */
export interface IDocument {
  id: string;
  meta: IDocumentMeta;
  theme: { light: IThemeTokens; dark: IThemeTokens };
  /** Плоский список, без вложенности */
  sections: ISection[];
  updatedAt: number;
}

/** Строка в списке проектов: сам документ хранится отдельно (core/documentStorage.ts) */
export interface IProjectMeta {
  id: string;
  title: string;
  updatedAt: number;
}
