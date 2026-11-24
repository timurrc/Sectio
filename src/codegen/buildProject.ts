import { EXPORT_PATHS } from "@/constants/export";
import { resolveSection } from "@/core/resolveSection";
import type { IDocument } from "@/types/document.types";
import { sectionComponentNames } from "./componentNames";
import type { IGeneratedProject } from "./generateProject";
import { printFile } from "./print";
import {
  containerTsx,
  gitignore,
  indexCss,
  indexHtml,
  mainTsx,
  packageJson,
  readme,
  tsconfigJson,
  viteConfig,
} from "./projectFiles";
import { appFile, type IAppSection, sectionFile } from "./sectionFile";

/** Документ → файлы проекта. Только читает модель */
export const buildProject = async (doc: IDocument): Promise<IGeneratedProject> => {
  const names = sectionComponentNames(doc.sections);
  const invalidSections: string[] = [];
  const sectionPaths: Record<string, string> = {};
  const appSections: IAppSection[] = [];

  const sectionFiles = await Promise.all(
    doc.sections.map(async (section) => {
      const resolved = resolveSection(section);
      if (!resolved) return null;
      if (!resolved.isValid) invalidSections.push(resolved.block.name);

      const name = names.get(section.id)!;
      const path = `${EXPORT_PATHS.sectionsDir}/${name}.tsx`;
      const { default: codegen } = await resolved.block.codegen();
      const content = await printFile(
        sectionFile(name, codegen(resolved.props, resolved.variant, name)),
        path,
      );
      return { section, name, path, content };
    }),
  );

  const files: Record<string, string> = {};
  for (const item of sectionFiles) {
    if (!item) continue;
    files[item.path] = item.content;
    sectionPaths[item.section.id] = item.path;
    appSections.push({ name: item.name, isDark: item.section.theme === "dark" });
  }

  return {
    files: {
      "package.json": packageJson(doc),
      "index.html": indexHtml(doc),
      "vite.config.ts": viteConfig(),
      "tsconfig.json": tsconfigJson(),
      "README.md": readme(doc),
      ".gitignore": gitignore(),
      "src/main.tsx": mainTsx(),
      "src/index.css": indexCss(doc),
      [EXPORT_PATHS.app]: await printFile(appFile(appSections), EXPORT_PATHS.app),
      [EXPORT_PATHS.container]: containerTsx(),
      ...files,
    },
    sectionPaths,
    invalidSections,
  };
};
