import { describe, expect, it } from "vitest";
import { z } from "zod";
import { BLOCKS } from "@/blocks/registry";
import {
  emptyValue,
  getAt,
  getSchemaFields,
  issuesToErrors,
  setAt,
  toFieldNode,
} from "./schemaFields";

describe("schemaFields", () => {
  it("строит поля из схемы с подписями из meta", () => {
    const schema = z.object({
      title: z.string().min(1).meta({ label: "Заголовок" }),
      subtitle: z.string().meta({ label: "Подзаголовок", multiline: true }),
      count: z.number(),
      visible: z.boolean().optional(),
    });
    expect(getSchemaFields(schema)).toEqual([
      { key: "title", label: "Заголовок", kind: "text", multiline: false, required: true },
      { key: "subtitle", label: "Подзаголовок", kind: "text", multiline: true, required: false },
      { key: "count", label: "Count", kind: "number" },
      { key: "visible", label: "Visible", kind: "boolean" },
    ]);
  });

  it("массивы: границы, элемент-объект и массив строк", () => {
    const node = toFieldNode(
      z
        .array(z.object({ name: z.string(), tags: z.array(z.string()) }))
        .min(1)
        .max(3)
        .meta({ label: "Тарифы", itemLabel: "Тариф" }),
      "plans",
    );
    expect(node).toMatchObject({
      kind: "list",
      label: "Тарифы",
      itemLabel: "Тариф",
      min: 1,
      max: 3,
    });
    if (node.kind !== "list" || node.item.kind !== "object") throw new Error("ожидался список");
    expect(node.item.fields[1]).toMatchObject({ kind: "list", item: { kind: "text" } });
  });

  it("у каждого поля всех блоков есть подпись", () => {
    const labels: string[] = [];
    const walk = (fields: ReturnType<typeof getSchemaFields>) =>
      fields.forEach((field) => {
        labels.push(field.label);
        if (field.kind === "object") walk(field.fields);
        if (field.kind === "list" && field.item.kind === "object") walk(field.item.fields);
      });
    Object.values(BLOCKS).forEach((block) => walk(getSchemaFields(block.schema)));
    expect(labels.length).toBeGreaterThan(20);
    expect(labels.every((label) => /[а-яё]/i.test(label))).toBe(true);
  });

  it("emptyValue проходит схему для обязательных строк", () => {
    const schema = z.object({ title: z.string().min(1), items: z.array(z.string()).min(2) });
    const value = emptyValue(toFieldNode(schema));
    expect(schema.safeParse(value).success).toBe(true);
  });

  it("getAt / setAt работают по пути и не мутируют исходник", () => {
    const source = { plans: [{ name: "A", features: ["x"] }] };
    const next = setAt(source, ["plans", 0, "features", 0], "y");
    expect(getAt(next, ["plans", 0, "features", 0])).toBe("y");
    expect(source.plans[0].features[0]).toBe("x");
    expect(Array.isArray(getAt(next, ["plans"]))).toBe(true);
  });

  it("issuesToErrors даёт понятные сообщения по пути", () => {
    const schema = z.object({ title: z.string().min(1), items: z.array(z.string()).min(1) });
    const result = schema.safeParse({ title: "", items: [] });
    expect(issuesToErrors(result.error!.issues)).toEqual({
      title: "Заполните поле",
      items: "Нужно хотя бы 1",
    });
  });
});
