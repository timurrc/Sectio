import { generateProject } from "@/codegen/generateProject";
import { toFileName } from "@/codegen/projectFiles";
import type { IDocument } from "@/types/document.types";

/** Файлы проекта → zip. JSZip грузится лениво */
export const buildZip = async (files: Record<string, string>): Promise<Blob> => {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const [path, content] of Object.entries(files)) zip.file(path, content);
  return zip.generateAsync({ type: "blob" });
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // Даём браузеру начать скачивание, потом освобождаем память
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Скачивает проект zip-архивом. Возвращает блоки, заменённые на defaults */
export const downloadProjectZip = async (doc: IDocument) => {
  const project = await generateProject(doc);
  downloadBlob(await buildZip(project.files), `${toFileName(doc.meta.title)}.zip`);
  return project.invalidSections;
};

/** Открывает проект в StackBlitz в новой вкладке. SDK грузится лениво */
export const openProjectInStackBlitz = async (doc: IDocument) => {
  const [project, { default: sdk }] = await Promise.all([
    generateProject(doc),
    import("@stackblitz/sdk"),
  ]);
  sdk.openProject(
    {
      title: doc.meta.title,
      description: doc.meta.description || "Лендинг из Sectio",
      template: "node",
      files: project.files,
    },
    { newWindow: true, openFile: "src/App.tsx" },
  );
  return project.invalidSections;
};
