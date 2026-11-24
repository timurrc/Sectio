import { current } from "immer";
import { temporal } from "zundo";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  IDocument,
  IDocumentMeta,
  ISection,
  IThemeTokens,
  SectionTheme,
} from "@/types/document.types";

interface DocumentState {
  document: IDocument | null;
}

interface DocumentActions {
  /** Открывает документ и сбрасывает историю undo/redo */
  setDocument: (document: IDocument | null) => void;
  /** Вставляет готовую секцию на позицию index (по умолчанию — в конец) */
  insertSection: (section: ISection, index?: number) => void;
  moveSection: (id: string, toIndex: number) => void;
  removeSection: (id: string) => void;
  /** Копия сразу после оригинала; id для копии передаёт вызывающий (nanoid) */
  duplicateSection: (id: string, newId: string) => void;
  updateSectionProps: (id: string, props: unknown) => void;
  updateSection: (id: string, patch: { variant?: string; theme?: SectionTheme }) => void;
  updateMeta: (patch: Partial<IDocumentMeta>) => void;
  updateThemeTokens: (theme: SectionTheme, patch: Partial<IThemeTokens>) => void;
}

export type DocumentStore = DocumentState & DocumentActions;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Модель документа. Всё, что меняет лендинг (DnD, инспектор, палитра, шаблоны),
 * идёт через эти экшены. Превью, код и экспорт только читают `document`.
 * История undo/redo (zundo) хранит только `document`.
 */
export const useDocumentStore = create<DocumentStore>()(
  temporal(
    immer((set) => {
      /** Мутация документа + обновление updatedAt. Без открытого документа ничего не делает */
      const mutate = (fn: (document: IDocument) => void) =>
        set((state) => {
          if (!state.document) return;
          fn(state.document);
          state.document.updatedAt = Date.now();
        });

      return {
        document: null,

        setDocument: (document) => {
          set({ document });
          useDocumentStore.temporal.getState().clear();
        },

        insertSection: (section, index) =>
          mutate((doc) => {
            const at = clamp(index ?? doc.sections.length, 0, doc.sections.length);
            doc.sections.splice(at, 0, section);
          }),

        moveSection: (id, toIndex) =>
          mutate((doc) => {
            const from = doc.sections.findIndex((section) => section.id === id);
            if (from === -1) return;
            const [section] = doc.sections.splice(from, 1);
            doc.sections.splice(clamp(toIndex, 0, doc.sections.length), 0, section);
          }),

        removeSection: (id) =>
          mutate((doc) => {
            doc.sections = doc.sections.filter((section) => section.id !== id);
          }),

        duplicateSection: (id, newId) =>
          mutate((doc) => {
            const index = doc.sections.findIndex((section) => section.id === id);
            if (index === -1) return;
            doc.sections.splice(index + 1, 0, {
              ...structuredClone(current(doc.sections[index])),
              id: newId,
            });
          }),

        updateSectionProps: (id, props) =>
          mutate((doc) => {
            const section = doc.sections.find((item) => item.id === id);
            if (section) section.props = props;
          }),

        updateSection: (id, patch) =>
          mutate((doc) => {
            const section = doc.sections.find((item) => item.id === id);
            if (section) Object.assign(section, patch);
          }),

        updateMeta: (patch) =>
          mutate((doc) => {
            Object.assign(doc.meta, patch);
          }),

        updateThemeTokens: (theme, patch) =>
          mutate((doc) => {
            Object.assign(doc.theme[theme], patch);
          }),
      };
    }),
    {
      limit: 100,
      partialize: (state) => ({ document: state.document }),
      // Не пишем в историю вызовы, которые ничего не поменяли
      equality: (past, current) => past.document === current.document,
    },
  ),
);

export const selectSections = (state: DocumentStore) => state.document?.sections;

export const selectSection = (id: string | null) => (state: DocumentStore) =>
  id ? state.document?.sections.find((section) => section.id === id) : undefined;
