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
  /** Заменяет все секции разом (применение шаблона): один шаг undo */
  replaceSections: (sections: ISection[]) => void;
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

/** Правки одной группы, идущие подряд быстрее этого интервала, — один шаг undo */
export const HISTORY_GROUP_MS = 800;

/**
 * Группировка истории. Экшен перед set() помечает группу правки (например, props секции),
 * а handleSet не пишет новый шаг, если предыдущий шаг был той же группы и недавно.
 * Ввод в поле инспектора или протяжка цвета отменяются одним ⌘Z, а не по символу.
 */
let nextGroup: string | null = null;
const lastRecord = { group: null as string | null, at: 0, pastLength: -1 };

export const resetHistoryGroup = () => {
  lastRecord.group = null;
};

/**
 * Модель документа. Всё, что меняет лендинг (DnD, инспектор, палитра, шаблоны),
 * идёт через эти экшены. Превью, код и экспорт только читают `document`.
 * История undo/redo (zundo) хранит только `document`.
 */
export const useDocumentStore = create<DocumentStore>()(
  temporal(
    immer((set) => {
      /** Мутация документа + обновление updatedAt. Без открытого документа ничего не делает */
      const mutate = (fn: (document: IDocument) => void, group: string | null = null) => {
        nextGroup = group;
        set((state) => {
          if (!state.document) return;
          fn(state.document);
          state.document.updatedAt = Date.now();
        });
        nextGroup = null;
      };

      return {
        document: null,

        setDocument: (document) => {
          set({ document });
          useDocumentStore.temporal.getState().clear();
          resetHistoryGroup();
        },

        insertSection: (section, index) =>
          mutate((doc) => {
            const at = clamp(index ?? doc.sections.length, 0, doc.sections.length);
            doc.sections.splice(at, 0, section);
          }),

        replaceSections: (sections) =>
          mutate((doc) => {
            doc.sections = sections;
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
          }, `props:${id}`),

        updateSection: (id, patch) =>
          mutate((doc) => {
            const section = doc.sections.find((item) => item.id === id);
            if (section) Object.assign(section, patch);
          }),

        updateMeta: (patch) =>
          mutate((doc) => {
            Object.assign(doc.meta, patch);
          }, "meta"),

        updateThemeTokens: (theme, patch) =>
          mutate((doc) => {
            Object.assign(doc.theme[theme], patch);
          }, `theme:${theme}`),
      };
    }),
    {
      limit: 100,
      partialize: (state) => ({ document: state.document }),
      // Не пишем в историю вызовы, которые ничего не поменяли
      equality: (past, current) => past.document === current.document,
      handleSet:
        (handleSet) =>
        (...args: Parameters<typeof handleSet>) => {
          const group = nextGroup;
          const now = Date.now();
          const { pastStates, futureStates } = useDocumentStore.temporal.getState();
          const merge =
            group !== null &&
            group === lastRecord.group &&
            now - lastRecord.at < HISTORY_GROUP_MS &&
            // После undo/redo история сдвинулась — склеивать нельзя
            futureStates.length === 0 &&
            pastStates.length === lastRecord.pastLength;

          lastRecord.at = now;
          if (merge) return;

          handleSet(...args);
          lastRecord.group = group;
          lastRecord.pastLength = useDocumentStore.temporal.getState().pastStates.length;
        },
    },
  ),
);

// undo/redo/clear сдвигают историю: следующая правка всегда начинает новый шаг.
// handleSet обновляет lastRecord уже после этой подписки, поэтому свои записи не сбрасывает
useDocumentStore.temporal.subscribe(resetHistoryGroup);

export const selectSections = (state: DocumentStore) => state.document?.sections;

export const selectSection = (id: string | null) => (state: DocumentStore) =>
  id ? state.document?.sections.find((section) => section.id === id) : undefined;
