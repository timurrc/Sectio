import type { IDocument } from "@/types/document.types";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import { useProjectsStore } from "@/store/projects.store";
import { documentStorage } from "./documentStorage";

const SAVE_DELAY_MS = 400;

/** Загружает проект из IndexedDB в стор. false — такого проекта нет */
export const openDocument = async (id: string): Promise<boolean> => {
  const document = await documentStorage.load(id);
  if (!document) return false;
  useEditorStore.getState().reset();
  useDocumentStore.getState().setDocument(document);
  return true;
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
    void documentStorage.save(document);
    useProjectsStore.getState().touchProject({
      id: document.id,
      title: document.meta.title,
      updatedAt: document.updatedAt,
    });
  };

  const unsubscribe = useDocumentStore.subscribe((state, prev) => {
    const document = state.document;
    // Открытие/закрытие документа — не правка, сохранять нечего
    if (!document || document === prev.document || document.id !== prev.document?.id) return;

    pending = document;
    clearTimeout(timer);
    timer = setTimeout(flush, SAVE_DELAY_MS);
  });

  return () => {
    unsubscribe();
    flush(); // не теряем правки последних 400 мс при уходе со страницы
  };
};
