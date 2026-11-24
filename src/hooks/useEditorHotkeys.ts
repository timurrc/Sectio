import { useEffect } from "react";
import { runHotkeyAction } from "@/editor/commands";
import { matchHotkey, toHotkeyEvent } from "@/editor/hotkeys";
import { useEditorStore } from "@/store/editor.store";

/** В полях ввода клавиши принадлежат полю: ⌘Z, Backspace и стрелки работают как обычно */
const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** Хоткеи редактора в окне редактора. Нажатия внутри iframe приходят сообщением hotkey (Canvas) */
export const useEditorHotkeys = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditable(event.target)) return;
      // Стрелки и Esc во время перетаскивания принадлежат dnd-kit (сортировка с клавиатуры)
      if (useEditorStore.getState().isDragging) return;
      const action = matchHotkey(toHotkeyEvent(event));
      if (action && runHotkeyAction(action)) event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
};
