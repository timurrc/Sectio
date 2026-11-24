import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useStore } from "zustand";
import { openDocument, startDocumentAutosave } from "@/editor/documentPersistence";
import { downloadProjectZip, openProjectInStackBlitz } from "@/editor/exportProject";
import { useEditorHotkeys } from "@/hooks/useEditorHotkeys";
import { selectSection, useDocumentStore } from "@/store/document.store";
import { type EditorTab, useEditorStore } from "@/store/editor.store";

type Status = "loading" | "ready" | "not-found";
type ExportTarget = "zip" | "stackblitz";

export const EDITOR_TABS: { id: EditorTab; label: string }[] = [
  { id: "preview", label: "Превью" },
  { id: "code", label: "Код" },
];

const EXPORTERS = { zip: downloadProjectZip, stackblitz: openProjectInStackBlitz };

export const useEditorPage = () => {
  const { id = "" } = useParams();
  const [loadedId, setLoadedId] = useState<{ id: string; found: boolean } | null>(null);
  const document = useDocumentStore((state) => state.document);
  const selectedId = useEditorStore((state) => state.selectedId);
  const tab = useEditorStore((state) => state.tab);
  const setTab = useEditorStore((state) => state.setTab);
  const paletteOpen = useEditorStore((state) => state.paletteOpen);
  const setPaletteOpen = useEditorStore((state) => state.setPaletteOpen);
  const [exporting, setExporting] = useState<ExportTarget | null>(null);
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

  /** Экспорт только читает модель; невалидные секции уходят с defaults — предупреждаем */
  const exportProject = async (target: ExportTarget) => {
    const current = useDocumentStore.getState().document;
    if (!current || exporting) return;
    setExporting(target);
    try {
      const invalid = await EXPORTERS[target](current);
      if (invalid.length > 0) {
        toast.error(
          `Данные секций не прошли проверку, взяты значения по умолчанию: ${invalid.join(", ")}`,
        );
      } else if (target === "zip") {
        toast.success("Архив проекта скачан");
      }
    } catch {
      toast.error(
        target === "zip"
          ? "Не удалось собрать архив"
          : "Не удалось открыть StackBlitz. Проверьте, что браузер не блокирует всплывающие окна",
      );
    } finally {
      setExporting(null);
    }
  };

  return {
    status,
    tab,
    setTab,
    exporting,
    downloadZip: () => exportProject("zip"),
    openStackBlitz: () => exportProject("stackblitz"),
    document,
    selectedSection,
    canUndo,
    canRedo,
    undo: () => temporal.getState().undo(),
    redo: () => temporal.getState().redo(),
    paletteOpen,
    openPalette: () => setPaletteOpen(true),
  };
};
