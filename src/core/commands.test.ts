import { beforeEach, describe, expect, it } from "vitest";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import { createDocument, createSection } from "./documentFactory";
import { runHotkeyAction } from "./commands";

const ids = () => useDocumentStore.getState().document?.sections.map((s) => s.id) ?? [];
const selected = () => useEditorStore.getState().selectedId;

beforeEach(() => {
  const document = createDocument();
  document.sections = ["hero", "features", "cta"].map((type, index) => ({
    ...createSection(type as "hero"),
    id: `s${index}`,
  }));
  useDocumentStore.getState().setDocument(document);
  useEditorStore.getState().reset();
});

describe("runHotkeyAction", () => {
  it("без выделения действия над секцией не выполняются", () => {
    expect(runHotkeyAction("delete")).toBe(false);
    expect(ids()).toEqual(["s0", "s1", "s2"]);
  });

  it("стрелки выбирают соседние секции, Esc снимает выделение", () => {
    runHotkeyAction("selectNext");
    expect(selected()).toBe("s0");
    runHotkeyAction("selectNext");
    runHotkeyAction("selectNext");
    runHotkeyAction("selectNext");
    expect(selected()).toBe("s2");
    runHotkeyAction("selectPrev");
    expect(selected()).toBe("s1");
    runHotkeyAction("deselect");
    expect(selected()).toBeNull();
  });

  it("delete удаляет и выделяет соседа", () => {
    useEditorStore.getState().select("s1");
    runHotkeyAction("delete");
    expect(ids()).toEqual(["s0", "s2"]);
    expect(selected()).toBe("s2");
    runHotkeyAction("delete");
    expect(selected()).toBe("s0");
  });

  it("duplicate выделяет копию", () => {
    useEditorStore.getState().select("s0");
    runHotkeyAction("duplicate");
    expect(ids()).toHaveLength(4);
    expect(selected()).toBe(ids()[1]);
  });

  it("moveUp / moveDown двигают секцию в пределах списка", () => {
    useEditorStore.getState().select("s0");
    runHotkeyAction("moveUp");
    expect(ids()).toEqual(["s0", "s1", "s2"]);
    runHotkeyAction("moveDown");
    expect(ids()).toEqual(["s1", "s0", "s2"]);
  });

  it("undo и redo", () => {
    expect(runHotkeyAction("undo")).toBe(false);
    useEditorStore.getState().select("s0");
    runHotkeyAction("delete");
    runHotkeyAction("undo");
    expect(ids()).toEqual(["s0", "s1", "s2"]);
    runHotkeyAction("redo");
    expect(ids()).toEqual(["s1", "s2"]);
  });
});
