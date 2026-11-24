import { describe, expect, it } from "vitest";
import { contrast, deriveHover, isHexColor } from "./color";

describe("color", () => {
  it("isHexColor принимает только #rrggbb", () => {
    expect(isHexColor("#4f46e5")).toBe(true);
    expect(isHexColor("#4F46E5")).toBe(true);
    expect(isHexColor("#fff")).toBe(false);
    expect(isHexColor("red")).toBe(false);
  });

  it("deriveHover темнее в светлой теме и светлее в тёмной", () => {
    const primary = "#4f46e5";
    expect(contrast(deriveHover(primary, "light"), "#ffffff")).toBeGreaterThan(
      contrast(primary, "#ffffff"),
    );
    expect(contrast(deriveHover(primary, "dark"), "#000000")).toBeGreaterThan(
      contrast(primary, "#000000"),
    );
    expect(isHexColor(deriveHover(primary, "light"))).toBe(true);
  });

  it("contrast по WCAG", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21);
    expect(contrast("#ffffff", "#ffffff")).toBeCloseTo(1);
    expect(contrast("oops", "#ffffff")).toBe(21);
  });
});
