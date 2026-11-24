import type { IHotkeyEvent } from "./protocol";

export type HotkeyAction =
  | "undo"
  | "redo"
  | "delete"
  | "duplicate"
  | "moveUp"
  | "moveDown"
  | "selectPrev"
  | "selectNext"
  | "deselect";

/** Подсказки для интерфейса (title кнопок) */
export const HOTKEY_HINTS: Record<HotkeyAction, string> = {
  undo: "⌘Z",
  redo: "⇧⌘Z",
  delete: "Delete",
  duplicate: "⌘D",
  moveUp: "⌥↑",
  moveDown: "⌥↓",
  selectPrev: "↑",
  selectNext: "↓",
  deselect: "Esc",
};

/**
 * Клавиша → действие редактора. Чистая функция: её используют и окно редактора,
 * и iframe превью (там фокус оказывается после клика по секции).
 */
export const matchHotkey = (event: IHotkeyEvent): HotkeyAction | null => {
  const mod = event.metaKey || event.ctrlKey;
  const key = event.key.toLowerCase();

  if (mod) {
    if (key === "z") return event.shiftKey ? "redo" : "undo";
    if (key === "y") return "redo";
    if (key === "d" && !event.shiftKey) return "duplicate";
    return null;
  }

  if (event.shiftKey) return null;

  switch (key) {
    case "arrowup":
      return event.altKey ? "moveUp" : "selectPrev";
    case "arrowdown":
      return event.altKey ? "moveDown" : "selectNext";
  }

  if (event.altKey) return null;

  switch (key) {
    case "delete":
    case "backspace":
      return "delete";
    case "escape":
      return "deselect";
    default:
      return null;
  }
};

export const toHotkeyEvent = (event: KeyboardEvent): IHotkeyEvent => ({
  key: event.key,
  metaKey: event.metaKey,
  ctrlKey: event.ctrlKey,
  shiftKey: event.shiftKey,
  altKey: event.altKey,
});
