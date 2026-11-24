import type { IDocument } from "@/types/document.types";

export interface IGeneratedProject {
  /** Путь в проекте → содержимое */
  files: Record<string, string>;
  /** id секции → путь её файла (вкладка «Код» открывает файл выделенной секции) */
  sectionPaths: Record<string, string>;
  /** Названия блоков, чьи props не прошли схему и заменены на defaults */
  invalidSections: string[];
}

/**
 * Точка входа кодогенерации. Сам генератор (Babel, Prettier, codegen блоков) грузится лениво,
 * поэтому этот модуль можно импортировать откуда угодно.
 */
export const generateProject = async (doc: IDocument): Promise<IGeneratedProject> => {
  const { buildProject } = await import("./buildProject");
  return buildProject(doc);
};
