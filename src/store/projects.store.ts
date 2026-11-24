import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { documentStorage } from "@/editor/documentStorage";
import { createDocument } from "@/editor/documentFactory";
import type { IDocument, IProjectMeta } from "@/types/document.types";

const idbStorage: StateStorage = {
  getItem: async (name) => (await get<string>(name)) ?? null,
  setItem: (name, value) => set(name, value),
  removeItem: (name) => del(name),
};

interface ProjectsState {
  projects: IProjectMeta[];
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

/** Список проектов в IndexedDB. Сами документы — в documentStorage */
export const useProjectsStore = create<ProjectsState>()(
  persist(
    (setState) => ({
      projects: [],

      createProject: async (document = createDocument()) => {
        await documentStorage.save(document);
        setState((state) => ({ projects: [toMeta(document), ...state.projects] }));
        return document.id;
      },

      renameProject: async (id, title) => {
        const updatedAt = Date.now();
        const document = await documentStorage.load(id);
        if (document) {
          await documentStorage.save({ ...document, meta: { ...document.meta, title }, updatedAt });
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
      },
    }),
    {
      name: "sectio:projects",
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ projects: state.projects }),
    },
  ),
);
