import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "zustand";
import { openDocument, startDocumentAutosave } from "@/editor/documentPersistence";
import { useEditorHotkeys } from "@/hooks/useEditorHotkeys";
import { selectSection, useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";

type Status = "loading" | "ready" | "not-found";

export const useEditorPage = () => {
  const { id = "" } = useParams();
  const [loadedId, setLoadedId] = useState<{ id: string; found: boolean } | null>(null);
  const document = useDocumentStore((state) => state.document);
  const selectedId = useEditorStore((state) => state.selectedId);
  // Секция могла исчезнуть (undo добавления) — тогда справа снова настройки страницы
  const selectedSection = useDocumentStore(selectSection(selectedId));

  // Автосохранение живёт, пока открыт редактор
  useEffect(() => startDocumentAutosave(), []);

  useEffect(() => {
    let cancelled = false;
    openDocument(id).then((found) => {
      if (!cancelled) setLoadedId({ id, found });
    });
    return () => {
      cancelled = true;
      useDocumentStore.getState().setDocument(null);
    };
  }, [id]);

  const status: Status =
    loadedId?.id !== id ? "loading" : loadedId.found && document ? "ready" : "not-found";

  useEditorHotkeys(status === "ready");

  const temporal = useDocumentStore.temporal;
  const canUndo = useStore(temporal, (state) => state.pastStates.length > 0);
  const canRedo = useStore(temporal, (state) => state.futureStates.length > 0);

  return {
    status,
    document,
    selectedSection,
    canUndo,
    canRedo,
    undo: () => temporal.getState().undo(),
    redo: () => temporal.getState().redo(),
  };
};
