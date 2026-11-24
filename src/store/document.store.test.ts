import { beforeEach, describe, expect, it } from "vitest";
import { createDocument } from "@/editor/documentFactory";
import type { ISection } from "@/types/document.types";
import { useDocumentStore } from "./document.store";

const section = (id: string, props: unknown = { title: id }): ISection => ({
  id,
  type: "hero",
  variant: "centered",
  theme: "light",
  props,
});

const ids = () => useDocumentStore.getState().document?.sections.map((s) => s.id);
const state = () => useDocumentStore.getState();
const history = () => useDocumentStore.temporal.getState();

beforeEach(() => {
  state().setDocument(createDocument("Тест"));
});

describe("document.store", () => {
  it("setDocument открывает документ и очищает историю", () => {
    state().insertSection(section("a"));
    state().setDocument(createDocument());
    expect(history().pastStates).toHaveLength(0);
  });

  it("insertSection добавляет в конец и на заданную позицию", () => {
    state().insertSection(section("a"));
    state().insertSection(section("b"));
    state().insertSection(section("c"), 1);
    expect(ids()).toEqual(["a", "c", "b"]);
  });

  it("moveSection переставляет секцию", () => {
    ["a", "b", "c"].forEach((id) => state().insertSection(section(id)));
    state().moveSection("a", 2);
    expect(ids()).toEqual(["b", "c", "a"]);
    state().moveSection("a", 0);
    expect(ids()).toEqual(["a", "b", "c"]);
  });

  it("moveSection с неизвестным id ничего не ломает", () => {
    state().insertSection(section("a"));
    state().moveSection("nope", 0);
    expect(ids()).toEqual(["a"]);
  });

  it("removeSection удаляет секцию", () => {
    ["a", "b"].forEach((id) => state().insertSection(section(id)));
    state().removeSection("a");
    expect(ids()).toEqual(["b"]);
  });

  it("duplicateSection вставляет независимую копию после оригинала", () => {
    state().insertSection(section("a", { title: "A" }));
    state().insertSection(section("b"));
    state().duplicateSection("a", "a2");
    expect(ids()).toEqual(["a", "a2", "b"]);

    state().updateSectionProps("a2", { title: "Копия" });
    expect(state().document?.sections[0].props).toEqual({ title: "A" });
  });

  it("updateSectionProps и updateSection меняют секцию и updatedAt", () => {
    state().insertSection(section("a"));
    const before = state().document!.updatedAt;

    state().updateSectionProps("a", { title: "Новый" });
    state().updateSection("a", { variant: "split", theme: "dark" });

    const updated = state().document!.sections[0];
    expect(updated).toMatchObject({ props: { title: "Новый" }, variant: "split", theme: "dark" });
    expect(state().document!.updatedAt).toBeGreaterThanOrEqual(before);
  });

  it("updateMeta и updateThemeTokens меняют документ", () => {
    state().updateMeta({ title: "Кофейня" });
    state().updateThemeTokens("dark", { primary: "#ff0000" });
    expect(state().document?.meta.title).toBe("Кофейня");
    expect(state().document?.theme.dark.primary).toBe("#ff0000");
    expect(state().document?.theme.light.primary).not.toBe("#ff0000");
  });

  it("undo и redo откатывают и возвращают изменения", () => {
    state().insertSection(section("a"));
    state().insertSection(section("b"));

    history().undo();
    expect(ids()).toEqual(["a"]);
    history().undo();
    expect(ids()).toEqual([]);

    history().redo();
    expect(ids()).toEqual(["a"]);
  });

  it("экшены без открытого документа ничего не делают", () => {
    state().setDocument(null);
    state().insertSection(section("a"));
    expect(state().document).toBeNull();
  });
});
