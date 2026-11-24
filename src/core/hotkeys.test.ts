import { describe, expect, it } from "vitest";
import type { IHotkeyEvent } from "./protocol";
import { matchHotkey } from "./hotkeys";

const press = (key: string, mods: Partial<Omit<IHotkeyEvent, "key">> = {}) =>
  matchHotkey({ key, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, ...mods });

describe("matchHotkey", () => {
  it("undo и redo на ⌘ и Ctrl", () => {
    expect(press("z", { metaKey: true })).toBe("undo");
    expect(press("z", { ctrlKey: true })).toBe("undo");
    expect(press("Z", { metaKey: true, shiftKey: true })).toBe("redo");
    expect(press("y", { ctrlKey: true })).toBe("redo");
  });

  it("действия с секцией", () => {
    expect(press("d", { metaKey: true })).toBe("duplicate");
    expect(press("Delete")).toBe("delete");
    expect(press("Backspace")).toBe("delete");
    expect(press("ArrowUp", { altKey: true })).toBe("moveUp");
    expect(press("ArrowDown", { altKey: true })).toBe("moveDown");
  });

  it("навигация по секциям", () => {
    expect(press("ArrowUp")).toBe("selectPrev");
    expect(press("ArrowDown")).toBe("selectNext");
    expect(press("Escape")).toBe("deselect");
  });

  it("⌘K и Ctrl+K открывают палитру команд", () => {
    expect(press("k", { metaKey: true })).toBe("palette");
    expect(press("K", { ctrlKey: true })).toBe("palette");
    expect(press("k")).toBeNull();
  });

  it("остальное не трогает", () => {
    expect(press("a")).toBeNull();
    expect(press("s", { metaKey: true })).toBeNull();
    expect(press("Backspace", { shiftKey: true })).toBeNull();
    expect(press("Backspace", { altKey: true })).toBeNull();
  });
});
