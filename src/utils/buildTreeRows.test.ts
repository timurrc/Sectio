import { describe, expect, it } from "vitest";
import { buildTreeRows } from "./buildTreeRows";

describe("buildTreeRows", () => {
  it("строит дерево: папки раньше файлов, без повторов папок", () => {
    const rows = buildTreeRows([
      "package.json",
      "src/main.tsx",
      "src/sections/Hero.tsx",
      "index.html",
      "src/App.tsx",
    ]);
    expect(rows.map((row) => `${"  ".repeat(row.depth)}${row.name}`)).toEqual([
      "src",
      "  sections",
      "    Hero.tsx",
      "  App.tsx",
      "  main.tsx",
      "index.html",
      "package.json",
    ]);
    expect(rows[0]).toMatchObject({ kind: "dir", path: "src" });
  });
});
