import { getBlock } from "@/blocks/registry";
import type { ITemplate } from "@/constants/templates";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import type { IDocument, ISection } from "@/types/document.types";
import { createDocument, createSection } from "./documentFactory";

/** Секции шаблона: defaults блока + поля шаблона поверх, у каждой новый id */
export const createTemplateSections = (template: ITemplate): ISection[] =>
  template.sections.map(({ type, variant, theme, props }) => {
    const section = createSection(type, { variant, theme });
    if (props) section.props = { ...(section.props as object), ...structuredClone(props) };
    return section;
  });

/** Новый документ по шаблону: заголовок проекта — название шаблона */
export const createDocumentFromTemplate = (template: ITemplate): IDocument => ({
  ...createDocument(template.name),
  sections: createTemplateSections(template),
});

/** Заменяет секции открытого документа шаблоном. Тема и мета не трогаются, ⌘Z возвращает всё */
export const applyTemplate = (template: ITemplate) => {
  useDocumentStore.getState().replaceSections(createTemplateSections(template));
  useEditorStore.getState().select(null);
};

/** Секции, которые не прошли схему своего блока (для теста шаблонов) */
export const invalidTemplateSections = (template: ITemplate) =>
  createTemplateSections(template).filter((section) => {
    const block = getBlock(section.type);
    const knownVariant = block.variants.some((variant) => variant.id === section.variant);
    return !knownVariant || !block.schema.safeParse(section.props).success;
  });
