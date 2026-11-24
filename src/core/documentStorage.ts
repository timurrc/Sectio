import { del, entries, get, set } from "idb-keyval";
import type { IDocument, IProjectMeta } from "@/types/document.types";
import { DOCUMENT_VERSION, parseStoredDocument, toProjectMeta } from "./documentSchema";

const PREFIX = "sectio:doc:";
const key = (id: string) => `${PREFIX}${id}`;

/** Ключ старого общего списка проектов (до версии с одним документом на ключ) */
const LEGACY_LIST_KEY = "sectio:projects";

/**
 * Страховка при закрытии вкладки. Запись в IndexedDB асинхронна, и браузер может выгрузить
 * страницу раньше, чем она закончится. localStorage пишется синхронно: туда кладём
 * несохранённую версию, а при следующем чтении берём её, если она свежее.
 */
const UNSAVED_PREFIX = "sectio:unsaved:";
const unsavedKey = (id: string) => `${UNSAVED_PREFIX}${id}`;

export type LoadResult =
  { status: "ok"; document: IDocument } | { status: "not-found" } | { status: "corrupt" };

const updatedAtOf = (raw: unknown) =>
  typeof raw === "object" && raw !== null && "updatedAt" in raw && typeof raw.updatedAt === "number"
    ? raw.updatedAt
    : -1;

/** Запись из localStorage-страховки; приватный режим и битый JSON — как будто её нет */
const readUnsaved = (id: string): unknown => {
  try {
    const value = localStorage.getItem(unsavedKey(id));
    return value === null ? undefined : JSON.parse(value);
  } catch {
    return undefined;
  }
};

const dropUnsaved = (id: string, savedAt: number) => {
  try {
    if (updatedAtOf(readUnsaved(id)) <= savedAt) localStorage.removeItem(unsavedKey(id));
  } catch {
    // localStorage недоступен — страховки и не было
  }
};

/** id всех документов со страховкой в localStorage */
const unsavedIds = (): string[] => {
  try {
    return Object.keys(localStorage)
      .filter((name) => name.startsWith(UNSAVED_PREFIX))
      .map((name) => name.slice(UNSAVED_PREFIX.length));
  } catch {
    return [];
  }
};

const toStored = (document: IDocument) => ({ ...document, version: DOCUMENT_VERSION });

/**
 * Каждый документ — отдельный ключ IndexedDB. Списка проектов как отдельной записи нет:
 * он собирается из документов, поэтому две вкладки не перезаписывают друг другу список.
 */
export const documentStorage = {
  load: async (id: string): Promise<LoadResult> => {
    const stored = await get<unknown>(key(id));
    const unsaved = readUnsaved(id);
    const raw = updatedAtOf(unsaved) > updatedAtOf(stored) ? unsaved : stored;
    if (raw === undefined) return { status: "not-found" };

    const document = parseStoredDocument(raw);
    if (!document) return { status: "corrupt" };
    // Страховка оказалась свежее — дописываем её в IndexedDB
    if (raw === unsaved) await documentStorage.save(document);
    return { status: "ok", document };
  },

  save: async (document: IDocument) => {
    await set(key(document.id), toStored(document));
    dropUnsaved(document.id, document.updatedAt);
  },

  /** Синхронно кладёт документ в localStorage: для pagehide, когда ждать IndexedDB нельзя */
  stashUnsaved: (document: IDocument) => {
    try {
      localStorage.setItem(unsavedKey(document.id), JSON.stringify(toStored(document)));
    } catch {
      // Переполнение или приватный режим: остаётся только запись в IndexedDB
    }
  },

  remove: async (id: string) => {
    await del(key(id));
    try {
      localStorage.removeItem(unsavedKey(id));
    } catch {
      // нечего удалять
    }
  },

  /** Строки списка проектов, свежие сверху */
  list: async (): Promise<IProjectMeta[]> => {
    const all = await entries<IDBValidKey, unknown>();
    if (all.some(([name]) => name === LEGACY_LIST_KEY)) await del(LEGACY_LIST_KEY);

    const documents = new Map(
      all
        .filter(([name]) => typeof name === "string" && name.startsWith(PREFIX))
        .map(([name, raw]) => [(name as string).slice(PREFIX.length), raw]),
    );
    for (const id of unsavedIds()) {
      const unsaved = readUnsaved(id);
      if (updatedAtOf(unsaved) > updatedAtOf(documents.get(id))) documents.set(id, unsaved);
    }

    return [...documents]
      .map(([id, raw]) => toProjectMeta(id, raw))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
};
