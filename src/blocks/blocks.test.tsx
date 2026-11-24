import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BLOCKS } from "./registry";

const blocks = Object.values(BLOCKS);

// Исходники компонентов блоков — проверяем правила стиля
const sources = import.meta.glob("./*/*.tsx", { query: "?raw", import: "default", eager: true });

describe("реестр блоков", () => {
  it("содержит блоки этапа 1", () => {
    expect(Object.keys(BLOCKS).sort()).toEqual(["cta", "features", "footer", "hero", "pricing"]);
  });

  describe.each(blocks.map((block) => [block.type, block] as const))("%s", (_, block) => {
    it("имеет теги и уникальные id вариантов", () => {
      expect(block.tags.length).toBeGreaterThan(0);
      const ids = block.variants.map((variant) => variant.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.length).toBeGreaterThanOrEqual(2);
    });

    it.each(block.variants.map((variant) => variant.id))("рендерит вариант %s", (variant) => {
      const { container } = render(<block.Component props={block.defaults} variant={variant} />);
      const firstText = Object.values(block.defaults).find(
        (value): value is string => typeof value === "string" && value.length > 0,
      );
      expect(container.textContent).toContain(firstText);
    });

    it("варианты дают разную разметку", () => {
      const html = block.variants.map(
        (variant) =>
          render(<block.Component props={block.defaults} variant={variant.id} />).container
            .innerHTML,
      );
      expect(new Set(html).size).toBe(html.length);
    });
  });
});

describe("стиль блоков", () => {
  const entries = Object.entries(sources) as [string, string][];

  it.each(entries)("%s: без хексов и inline-style, цвета через токены", (_, source) => {
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(source).not.toMatch(/style=\{/);
  });
});
