import { describe, expect, it } from "vitest";
import { z } from "zod";
import type { BlockType } from "@/types/document.types";
import { defineBlock, getBlock } from "./registry";

const schema = z.object({ title: z.string().min(1) });

const base = {
  type: "hero" as const,
  name: "Hero",
  tags: ["hero"],
  variants: [{ id: "centered", name: "По центру" }],
  schema,
  defaults: { title: "Привет" },
  Component: () => null,
  codegen: async () => ({ default: () => [] }),
};

describe("defineBlock", () => {
  it("возвращает блок без изменений, если он валиден", () => {
    expect(defineBlock(base)).toBe(base);
  });

  it("падает, если defaults не проходят схему", () => {
    expect(() => defineBlock({ ...base, defaults: { title: "" } })).toThrow(/defaults/);
  });

  it("падает без вариантов", () => {
    expect(() => defineBlock({ ...base, variants: [] })).toThrow(/вариант/);
  });
});

describe("getBlock", () => {
  it("бросает понятную ошибку для незарегистрированного блока", () => {
    expect(() => getBlock("unknown" as BlockType)).toThrow(/не зарегистрирован/);
  });
});
