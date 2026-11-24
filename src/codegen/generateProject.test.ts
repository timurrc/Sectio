import { describe, expect, it } from "vitest";
import { createDocument, createSection } from "@/editor/documentFactory";
import { buildZip } from "@/editor/exportProject";
import type { IDocument } from "@/types/document.types";
import { sectionComponentNames } from "./componentNames";
import { generateProject } from "./generateProject";
import { toFileName, toPackageName } from "./projectFiles";

const makeDoc = (): IDocument => {
  const doc = createDocument("Мой лендинг");
  doc.meta.description = 'Описание с "кавычками" и <тегом>';
  doc.sections = [
    createSection("hero"),
    createSection("features", { variant: "list", theme: "dark" }),
    createSection("hero", { variant: "split" }),
    createSection("footer"),
  ];
  return doc;
};

describe("sectionComponentNames", () => {
  it("даёт уникальные имена по порядку", () => {
    const names = sectionComponentNames([
      { id: "a", type: "hero" },
      { id: "b", type: "cta" },
      { id: "c", type: "hero" },
    ]);
    expect([...names.values()]).toEqual(["Hero", "Cta", "Hero2"]);
  });
});

describe("toPackageName", () => {
  it("делает допустимое имя пакета", () => {
    expect(toPackageName("My Landing 2.0!")).toBe("my-landing-2-0");
    expect(toPackageName("Мой лендинг")).toBe("landing");
  });
});

describe("toFileName", () => {
  it("оставляет кириллицу и убирает запрещённые символы", () => {
    expect(toFileName('Мой: лендинг/"v2"')).toBe("Мой лендинг v2");
    expect(toFileName("  ")).toBe("landing");
  });
});

describe("generateProject", () => {
  it("собирает все файлы проекта", async () => {
    const doc = makeDoc();
    const { files, sectionPaths, invalidSections } = await generateProject(doc);

    expect(Object.keys(files).sort()).toEqual(
      [
        ".gitignore",
        "README.md",
        "index.html",
        "package.json",
        "src/App.tsx",
        "src/components/Container.tsx",
        "src/index.css",
        "src/main.tsx",
        "src/sections/Features.tsx",
        "src/sections/Footer.tsx",
        "src/sections/Hero.tsx",
        "src/sections/Hero2.tsx",
        "tsconfig.json",
        "vite.config.ts",
      ].sort(),
    );
    expect(sectionPaths[doc.sections[2].id]).toBe("src/sections/Hero2.tsx");
    expect(invalidSections).toEqual([]);
  });

  it("App.tsx: секции по порядку, тёмная обёрнута в .dark", async () => {
    const { files } = await generateProject(makeDoc());
    expect(files["src/App.tsx"]).toMatchSnapshot();
  });

  it("index.css содержит токены обеих тем, index.html — экранированную мету", async () => {
    const doc = makeDoc();
    const { files } = await generateProject(doc);

    expect(files["src/index.css"]).toContain(`--color-primary: ${doc.theme.light.primary};`);
    expect(files["src/index.css"]).toContain(".dark {");
    expect(files["index.html"]).toContain("<title>Мой лендинг</title>");
    expect(files["index.html"]).toContain("&quot;кавычками&quot; и &lt;тегом&gt;");
    expect(JSON.parse(files["package.json"]).dependencies.react).toBeDefined();
  });

  it("невалидные props заменяет defaults и сообщает об этом", async () => {
    const doc = makeDoc();
    doc.sections[0].props = { title: 42 };
    const { files, invalidSections } = await generateProject(doc);

    expect(invalidSections).toEqual(["Главный экран"]);
    expect(files["src/sections/Hero.tsx"]).toContain("Запустите лендинг за один вечер");
  });

  it("данные секции попадают в файл как есть, с экранированием", async () => {
    const doc = makeDoc();
    doc.sections[0].props = {
      ...(doc.sections[0].props as object),
      title: 'Заголовок с "кавычками" и {скобками}',
    };
    const { files } = await generateProject(doc);
    expect(files["src/sections/Hero.tsx"]).toContain(
      "title: 'Заголовок с \"кавычками\" и {скобками}'",
    );
  });
});

describe("buildZip", () => {
  it("кладёт файлы по путям", async () => {
    const { default: JSZip } = await import("jszip");
    const blob = await buildZip({ "a.txt": "привет", "src/b.ts": "export {};" });
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());

    expect(Object.keys(zip.files).filter((path) => !zip.files[path].dir)).toEqual([
      "a.txt",
      "src/b.ts",
    ]);
    expect(await zip.file("a.txt")!.async("string")).toBe("привет");
  });
});
