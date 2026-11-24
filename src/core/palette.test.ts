import { beforeEach, describe, expect, it } from "vitest";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import { createDocument, createSection } from "./documentFactory";
import { getPaletteItems } from "./palette";
import { searchItems } from "./search";

const find = (id: string) => getPaletteItems().find((item) => item.id === id);
const sections = () => useDocumentStore.getState().document?.sections ?? [];

beforeEach(() => {
  const document = createDocument();
  document.sections = [
    { ...createSection("hero"), id: "s0" },
    { ...createSection("cta"), id: "s1" },
  ];
  useDocumentStore.getState().setDocument(document);
  useEditorStore.getState().reset();
});

describe("getPaletteItems", () => {
  it("без выделения нет действий над секцией, но есть блоки и шаблоны", () => {
    const items = getPaletteItems();
    expect(items.some((item) => item.id.startsWith("section:"))).toBe(false);
    expect(items.filter((item) => item.group === "Блоки").length).toBeGreaterThanOrEqual(18);
    expect(items.some((item) => item.group === "Шаблоны")).toBe(true);
  });

  it("пункт блока добавляет секцию нужного варианта после выбранной", () => {
    useEditorStore.getState().select("s0");
    find("block:faq:columns")?.run();
    expect(sections().map((section) => section.type)).toEqual(["hero", "faq", "cta"]);
    expect(sections()[1].variant).toBe("columns");
    expect(useEditorStore.getState().selectedId).toBe(sections()[1].id);
  });

  it("действия над секцией учитывают её позицию", () => {
    useEditorStore.getState().select("s0");
    expect(find("section:up")).toBeUndefined();
    expect(find("section:down")?.subtitle).toBe("Главный экран");
    find("section:down")?.run();
    expect(sections().map((section) => section.id)).toEqual(["s1", "s0"]);
  });

  it("переключает тему секции", () => {
    useEditorStore.getState().select("s1");
    find("section:theme")?.run();
    expect(sections()[1].theme).toBe("dark");
    expect(find("section:theme")?.title).toBe("Сделать секцию светлой");
  });

  it("undo появляется только при наличии истории", () => {
    expect(find("history:undo")).toBeUndefined();
    useDocumentStore.getState().removeSection("s1");
    find("history:undo")?.run();
    expect(sections()).toHaveLength(2);
  });
});

describe("searchItems", () => {
  const items = () => getPaletteItems();
  const titles = (query: string) => searchItems(items(), query).map((item) => item.id);

  it("пустой запрос возвращает все пункты", () => {
    expect(searchItems(items(), "  ")).toHaveLength(items().length);
  });

  it("находит блоки по названию, тегам на русском и английском", () => {
    expect(titles("отзывы")[0]).toMatch(/^block:testimonials/);
    expect(titles("pricing")[0]).toMatch(/^block:pricing/);
    expect(titles("кнопка")[0]).toMatch(/^block:cta/);
    expect(titles("шапка")[0]).toMatch(/^block:navbar/);
  });

  it("терпит опечатку", () => {
    expect(titles("тарифи")[0]).toMatch(/^block:pricing/);
  });

  it("находит вариант блока и шаблоны", () => {
    expect(titles("аккордеон")[0]).toBe("block:faq:accordion");
    expect(titles("шаблон").every((id) => id.startsWith("template:"))).toBe(true);
  });

  it("на бессмыслицу ничего не находит", () => {
    expect(titles("zzqxw")).toEqual([]);
  });
});
