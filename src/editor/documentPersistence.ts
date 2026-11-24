import { BLOCKS } from "@/blocks/registry";
import type { IDocument } from "@/types/document.types";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import { useProjectsStore } from "@/store/projects.store";
import { documentStorage } from "./documentStorage";
import { notifyProjectsChanged } from "./projectsSync";

const SAVE_DELAY_MS = 400;

export type OpenResult =
  | {
      status: "ok";
      /** Типы секций, которых нет в реестре блоков: такие секции не открываются */
      skippedTypes: string[];
    }
  | { status: "not-found" }
  | { status: "corrupt" };

/** Загружает проект из IndexedDB в стор */
export const openDocument = async (id: string): Promise<OpenResult> => {
  const loaded = await documentStorage.load(id);
  if (loaded.status !== "ok") return loaded;

  const { document } = loaded;
  const sections = document.sections.filter((section) => section.type in BLOCKS);
  const skippedTypes = [
    ...new Set(
      document.sections.filter((section) => !(section.type in BLOCKS)).map(({ type }) => type),
    ),
  ];

  useEditorStore.getState().reset();
  useDocumentStore.getState().setDocument({ ...document, sections });
  return { status: "ok", skippedTypes };
};

/**
 * Автосохранение: при изменении модели пишет документ в IndexedDB (с задержкой)
 * и обновляет строку в списке проектов. Возвращает функцию отписки.
 */
export const startDocumentAutosave = (): (() => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: IDocument | null = null;

  const flush = () => {
    clearTimeout(timer);
    if (!pending) return;
    const document = pending;
    pending = null;
    void documentStorage.save(document).then(() => notifyProjectsChanged({ id: document.id }));
    useProjectsStore.getState().touchProject({
      id: document.id,
      title: document.meta.title,
      updatedAt: document.updatedAt,
    });
  };

  // Перезагрузка, закрытие вкладки и уход в фон не ждут таймер: пишем сразу
  const flushOnHide = () => {
    if (window.document.visibilityState === "hidden") flush();
  };

  const unsubscribe = useDocumentStore.subscribe((state, prev) => {
    const document = state.document;
    // Открытие/закрытие документа — не правка, сохранять нечего
    if (!document || document === prev.document || document.id !== prev.document?.id) return;

    pending = document;
    clearTimeout(timer);
    timer = setTimeout(flush, SAVE_DELAY_MS);
  });

  window.addEventListener("pagehide", flush);
  window.document.addEventListener("visibilitychange", flushOnHide);

  return () => {
    unsubscribe();
    window.removeEventListener("pagehide", flush);
    window.document.removeEventListener("visibilitychange", flushOnHide);
    flush(); // не теряем правки последних 400 мс при уходе со страницы
  };
};
