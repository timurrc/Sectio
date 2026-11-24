import { create } from "zustand";
import { createDocument } from "@/core/documentFactory";
import { documentStorage } from "@/core/documentStorage";
import { notifyProjectsChanged } from "@/core/projectsSync";
import type { IDocument, IProjectMeta } from "@/types/document.types";

interface ProjectsState {
  projects: IProjectMeta[];
  /** Список уже прочитан из IndexedDB (до этого пустой список — не «проектов нет») */
  loaded: boolean;
  /** Перечитывает список из IndexedDB: при открытии страницы и после правок в другой вкладке */
  load: () => Promise<void>;
  /** Создаёт документ (пустой или готовый, например из шаблона), сохраняет его и возвращает id */
  createProject: (document?: IDocument) => Promise<string>;
  renameProject: (id: string, title: string) => Promise<void>;
  /** Обновляет строку списка после автосохранения документа */
  touchProject: (meta: IProjectMeta) => void;
  deleteProject: (id: string) => Promise<void>;
}

const toMeta = (document: IDocument): IProjectMeta => ({
  id: document.id,
  title: document.meta.title,
  updatedAt: document.updatedAt,
});

/**
 * Список проектов. Источник — сами документы в IndexedDB (documentStorage.list),
 * отдельной записи со списком нет: так вкладки не затирают проекты друг друга.
 */
export const useProjectsStore = create<ProjectsState>()((setState) => ({
  projects: [],
  loaded: false,

  load: async () => {
    const projects = await documentStorage.list();
    setState({ projects, loaded: true });
  },

  createProject: async (document = createDocument()) => {
    await documentStorage.save(document);
    setState((state) => ({ projects: [toMeta(document), ...state.projects] }));
    notifyProjectsChanged({ id: document.id });
    return document.id;
  },

  renameProject: async (id, title) => {
    const updatedAt = Date.now();
    const loaded = await documentStorage.load(id);
    if (loaded.status === "ok") {
      const { document } = loaded;
      await documentStorage.save({ ...document, meta: { ...document.meta, title }, updatedAt });
      notifyProjectsChanged({ id });
    }
    setState((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, title, updatedAt } : project,
      ),
    }));
  },

  touchProject: (meta) =>
    setState((state) => ({
      projects: state.projects.map((project) => (project.id === meta.id ? meta : project)),
    })),

  deleteProject: async (id) => {
    await documentStorage.remove(id);
    setState((state) => ({ projects: state.projects.filter((project) => project.id !== id) }));
    notifyProjectsChanged({ id });
  },
}));
