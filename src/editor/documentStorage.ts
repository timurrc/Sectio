import { del, entries, get, set } from "idb-keyval";
import type { IDocument, IProjectMeta } from "@/types/document.types";
import { DOCUMENT_VERSION, parseStoredDocument, toProjectMeta } from "./documentSchema";

const PREFIX = "sectio:doc:";
const key = (id: string) => `${PREFIX}${id}`;

/** Ключ старого общего списка проектов (до версии с одним документом на ключ) */
const LEGACY_LIST_KEY = "sectio:projects";

export type LoadResult =
  { status: "ok"; document: IDocument } | { status: "not-found" } | { status: "corrupt" };

/**
 * Каждый документ — отдельный ключ IndexedDB. Списка проектов как отдельной записи нет:
 * он собирается из документов, поэтому две вкладки не перезаписывают друг другу список.
 */
export const documentStorage = {
  load: async (id: string): Promise<LoadResult> => {
    const raw = await get<unknown>(key(id));
    if (raw === undefined) return { status: "not-found" };
    const document = parseStoredDocument(raw);
    return document ? { status: "ok", document } : { status: "corrupt" };
  },

  save: (document: IDocument) => set(key(document.id), { ...document, version: DOCUMENT_VERSION }),

  remove: (id: string) => del(key(id)),

  /** Строки списка проектов, свежие сверху */
  list: async (): Promise<IProjectMeta[]> => {
    const all = await entries<IDBValidKey, unknown>();
    if (all.some(([name]) => name === LEGACY_LIST_KEY)) await del(LEGACY_LIST_KEY);

    return all
      .filter(([name]) => typeof name === "string" && name.startsWith(PREFIX))
      .map(([name, raw]) => toProjectMeta((name as string).slice(PREFIX.length), raw))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
};
