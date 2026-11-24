import { describe, expect, it } from "vitest";
import { DEFAULT_THEME_DARK, DEFAULT_THEME_LIGHT } from "@/constants/theme";
import { createDocument, createSection } from "./documentFactory";
import { DOCUMENT_VERSION, parseStoredDocument, toProjectMeta } from "./documentSchema";

const stored = () => ({
  ...createDocument("Лендинг"),
  sections: [createSection("hero")],
  version: DOCUMENT_VERSION,
});

describe("parseStoredDocument", () => {
  it("возвращает документ текущей версии без поля version", () => {
    const raw = stored();
    const document = parseStoredDocument(raw);

    expect(document).not.toHaveProperty("version");
    expect(document).toMatchObject({ id: raw.id, meta: raw.meta, sections: raw.sections });
  });

  it("документ без версии (сохранён до появления версий) открывается", () => {
    const raw: Partial<ReturnType<typeof stored>> = stored();
    delete raw.version;
    expect(parseStoredDocument(raw)?.id).toBe(raw.id);
  });

  it("документ из более новой версии не открывается", () => {
    expect(parseStoredDocument({ ...stored(), version: DOCUMENT_VERSION + 1 })).toBeNull();
  });

  it.each([
    ["не объект", "строка"],
    ["null", null],
    ["без секций", { ...stored(), sections: null }],
    ["без id", { ...stored(), id: "" }],
  ])("битая запись (%s) → null", (_name, raw) => {
    expect(parseStoredDocument(raw)).toBeNull();
  });

  it("битые токены темы и мета заменяются значениями по умолчанию", () => {
    const raw = {
      ...stored(),
      meta: { title: 42 },
      theme: { light: { ...DEFAULT_THEME_LIGHT, primary: 1 }, dark: null },
    };
    const document = parseStoredDocument(raw);

    expect(document?.meta).toEqual({ title: "Без названия", description: "" });
    expect(document?.theme.light.primary).toBe(DEFAULT_THEME_LIGHT.primary);
    expect(document?.theme.dark).toEqual(DEFAULT_THEME_DARK);
  });

  it("секция с неизвестным типом остаётся: её отсеивает реестр при открытии", () => {
    const raw = { ...stored(), sections: [{ id: "x", type: "removed", variant: "a", props: {} }] };
    expect(parseStoredDocument(raw)?.sections).toEqual([
      { id: "x", type: "removed", variant: "a", theme: "light", props: {} },
    ]);
  });
});

describe("toProjectMeta", () => {
  it("берёт название и дату из записи", () => {
    expect(toProjectMeta("a", { meta: { title: "Кофейня" }, updatedAt: 5 })).toEqual({
      id: "a",
      title: "Кофейня",
      updatedAt: 5,
    });
  });

  it.each([undefined, "x", { meta: { title: "" } }])("запасные значения для %j", (raw) => {
    expect(toProjectMeta("a", raw)).toEqual({ id: "a", title: "Без названия", updatedAt: 0 });
  });
});
