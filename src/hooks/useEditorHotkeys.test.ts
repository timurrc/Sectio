import { fireEvent, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { createDocument, createSection } from "@/core/documentFactory";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import { useEditorHotkeys } from "./useEditorHotkeys";

const count = () => useDocumentStore.getState().document?.sections.length;

beforeEach(() => {
  const section = createSection("hero");
  useDocumentStore.getState().setDocument({ ...createDocument(), sections: [section] });
  useEditorStore.getState().select(section.id);
});

describe("useEditorHotkeys", () => {
  it("Delete удаляет выбранную секцию, ⌘Z возвращает", () => {
    renderHook(() => useEditorHotkeys());
    fireEvent.keyDown(window, { key: "Delete" });
    expect(count()).toBe(0);
    fireEvent.keyDown(window, { key: "z", metaKey: true });
    expect(count()).toBe(1);
  });

  it("в полях ввода не срабатывает", () => {
    renderHook(() => useEditorHotkeys());
    const input = document.createElement("input");
    document.body.append(input);
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(count()).toBe(1);
    input.remove();
  });

  it("молчит во время перетаскивания", () => {
    renderHook(() => useEditorHotkeys());
    useEditorStore.getState().setDragging(true);
    fireEvent.keyDown(window, { key: "Delete" });
    expect(count()).toBe(1);
    useEditorStore.getState().setDragging(false);
  });

  it("⌘K открывает палитру даже из поля ввода, при открытой палитре хоткеи молчат", () => {
    renderHook(() => useEditorHotkeys());
    const input = document.createElement("input");
    document.body.append(input);
    fireEvent.keyDown(input, { key: "k", metaKey: true });
    expect(useEditorStore.getState().paletteOpen).toBe(true);

    fireEvent.keyDown(window, { key: "Delete" });
    expect(count()).toBe(1);
    useEditorStore.getState().setPaletteOpen(false);
    input.remove();
  });
});
