import { describe, expect, it } from "vitest";
import { DEFAULT_THEME_DARK, DEFAULT_THEME_LIGHT } from "@/constants/theme";
import { themeToCss } from "./themeToCss";

describe("themeToCss", () => {
  const css = themeToCss({ light: DEFAULT_THEME_LIGHT, dark: DEFAULT_THEME_DARK });

  it("light на :root, dark на .dark", () => {
    expect(css).toMatch(/:root \{[^}]*--color-primary: #4f46e5;/);
    expect(css).toMatch(/\.dark \{[^}]*--color-primary: #818cf8;/);
  });

  it("содержит все токены", () => {
    for (const name of ["primary-hover", "text", "muted", "bg", "surface", "border"]) {
      expect(css).toContain(`--color-${name}:`);
    }
    expect(css).toContain("--radius:");
    expect(css).toContain("--font:");
  });

  it("вырезает символы, которыми можно сломать стиль", () => {
    const evil = { ...DEFAULT_THEME_LIGHT, primary: "red;}</style><script>alert(1)</script>{" };
    const result = themeToCss({ light: evil, dark: DEFAULT_THEME_DARK });
    expect(result).not.toContain("<");
    expect(result).not.toContain("</style>");
    expect(result.match(/\{/g)).toHaveLength(2);
  });
});
