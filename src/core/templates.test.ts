import { beforeEach, describe, expect, it } from "vitest";
import { TEMPLATES } from "@/constants/templates";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import { createDocument, createSection } from "./documentFactory";
import {
  applyTemplate,
  createDocumentFromTemplate,
  createTemplateSections,
  invalidTemplateSections,
} from "./templates";

const [saas] = TEMPLATES;

describe("шаблоны", () => {
  it("id шаблонов уникальны", () => {
    const ids = TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(TEMPLATES.map((template) => [template.name, template] as const))(
    "%s: секции проходят схемы, варианты существуют",
    (_, template) => {
      expect(template.sections.length).toBeGreaterThan(0);
      expect(invalidTemplateSections(template)).toEqual([]);
    },
  );

  it("поля шаблона ложатся поверх defaults, остальные берутся из блока", () => {
    const hero = createTemplateSections(saas).find((section) => section.type === "hero");
    expect(hero?.props).toMatchObject({
      title: "Задачи команды в одном спокойном месте",
      ctaHref: "#",
    });
  });

  it("каждый вызов даёт новые id секций", () => {
    const first = createTemplateSections(saas).map((section) => section.id);
    const second = createTemplateSections(saas).map((section) => section.id);
    expect(first.some((id) => second.includes(id))).toBe(false);
  });

  it("createDocumentFromTemplate называет проект по шаблону", () => {
    const document = createDocumentFromTemplate(saas);
    expect(document.meta.title).toBe(saas.name);
    expect(document.sections).toHaveLength(saas.sections.length);
  });

  describe("applyTemplate", () => {
    beforeEach(() => {
      const section = createSection("cta");
      useDocumentStore.getState().setDocument({ ...createDocument(), sections: [section] });
      useEditorStore.getState().select(section.id);
    });

    it("заменяет секции, снимает выделение и отменяется одним ⌘Z", () => {
      applyTemplate(saas);
      const sections = useDocumentStore.getState().document?.sections ?? [];
      expect(sections.map((section) => section.type)).toEqual(saas.sections.map((s) => s.type));
      expect(useEditorStore.getState().selectedId).toBeNull();

      useDocumentStore.temporal.getState().undo();
      expect(useDocumentStore.getState().document?.sections.map((s) => s.type)).toEqual(["cta"]);
    });
  });
});
