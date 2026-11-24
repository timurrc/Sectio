import { nanoid } from "nanoid";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import type { BlockType } from "@/types/document.types";
import { createSection } from "./documentFactory";
import type { HotkeyAction } from "./hotkeys";

/**
 * Команды над выделенной секцией. Их вызывают хоткеи, Outline и инспектор,
 * поэтому логика «что выделить после» живёт в одном месте.
 */

const sections = () => useDocumentStore.getState().document?.sections ?? [];
const selectedIndex = () => {
  const { selectedId } = useEditorStore.getState();
  return sections().findIndex((section) => section.id === selectedId);
};

/** Добавляет секцию после выбранной (или в конец) и выделяет её. Библиотека блоков и ⌘K */
export const addSection = (type: BlockType, variant?: string) => {
  const list = sections();
  const index = selectedIndex();
  const section = createSection(type, { variant });
  useDocumentStore.getState().insertSection(section, index === -1 ? list.length : index + 1);
  useEditorStore.getState().select(section.id);
  return section.id;
};

/** Переключает тему секции light ↔ dark */
export const toggleSectionTheme = (id: string) => {
  const section = sections().find((item) => item.id === id);
  if (!section) return;
  useDocumentStore
    .getState()
    .updateSection(id, { theme: section.theme === "dark" ? "light" : "dark" });
};

export const removeSectionById = (id: string) => {
  const list = sections();
  const index = list.findIndex((section) => section.id === id);
  if (index === -1) return;
  const { selectedId, select } = useEditorStore.getState();
  useDocumentStore.getState().removeSection(id);
  // Выделение переходит на соседа, чтобы можно было удалять подряд
  if (selectedId === id) select((list[index + 1] ?? list[index - 1])?.id ?? null);
};

export const duplicateSectionById = (id: string) => {
  const newId = nanoid(10);
  useDocumentStore.getState().duplicateSection(id, newId);
  useEditorStore.getState().select(newId);
};

export const moveSectionBy = (id: string, offset: number) => {
  const index = sections().findIndex((section) => section.id === id);
  if (index === -1) return;
  const to = index + offset;
  if (to < 0 || to >= sections().length) return;
  useDocumentStore.getState().moveSection(id, to);
};

const selectBy = (offset: number) => {
  const list = sections();
  if (list.length === 0) return;
  const index = selectedIndex();
  const next = index === -1 ? (offset > 0 ? 0 : list.length - 1) : index + offset;
  const target = list[Math.min(Math.max(next, 0), list.length - 1)];
  useEditorStore.getState().select(target.id);
};

/** Выполняет действие хоткея. false — действие сейчас неприменимо (нечего отменять, ничего не выбрано) */
export const runHotkeyAction = (action: HotkeyAction): boolean => {
  const temporal = useDocumentStore.temporal.getState();
  const { selectedId, select } = useEditorStore.getState();

  switch (action) {
    case "undo":
      if (temporal.pastStates.length === 0) return false;
      temporal.undo();
      return true;
    case "redo":
      if (temporal.futureStates.length === 0) return false;
      temporal.redo();
      return true;
    case "selectPrev":
      selectBy(-1);
      return true;
    case "selectNext":
      selectBy(1);
      return true;
    case "deselect":
      if (!selectedId) return false;
      select(null);
      return true;
    case "palette":
      useEditorStore.getState().setPaletteOpen(true);
      return true;
  }

  if (!selectedId) return false;

  switch (action) {
    case "delete":
      removeSectionById(selectedId);
      return true;
    case "duplicate":
      duplicateSectionById(selectedId);
      return true;
    case "moveUp":
      moveSectionBy(selectedId, -1);
      return true;
    case "moveDown":
      moveSectionBy(selectedId, 1);
      return true;
  }
};
