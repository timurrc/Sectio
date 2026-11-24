import { del, get, set } from "idb-keyval";
import type { IDocument } from "@/types/document.types";

const key = (id: string) => `sectio:doc:${id}`;

/** Документы лежат в IndexedDB отдельно от списка проектов: список остаётся лёгким */
export const documentStorage = {
  load: (id: string) => get<IDocument>(key(id)),
  save: (document: IDocument) => set(key(document.id), document),
  remove: (id: string) => del(key(id)),
};
