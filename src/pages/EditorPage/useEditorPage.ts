import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useStore } from "zustand";
import { type OpenResult, openDocument, startDocumentAutosave } from "@/editor/documentPersistence";
import { downloadProjectZip, openProjectInStackBlitz } from "@/editor/exportProject";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useEditorHotkeys } from "@/hooks/useEditorHotkeys";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { selectSection, useDocumentStore } from "@/store/document.store";
import { type EditorTab, useEditorStore } from "@/store/editor.store";

type Status = "loading" | "ready" | "not-found" | "corrupt" | "narrow";

/** Уже этой ширины три панели редактора не помещаются */
export const EDITOR_MIN_WIDTH = 1024;
type ExportTarget = "zip" | "stackblitz";

export const EDITOR_TABS: { id: EditorTab; label: string }[] = [
  { id: "preview", label: "Превью" },
  { id: "code", label: "Код" },
];

const EXPORTERS = { zip: downloadProjectZip, stackblitz: openProjectInStackBlitz };

export const useEditorPage = () => {
  const { id = "" } = useParams();
  const [loaded, setLoaded] = useState<{ id: string; status: OpenResult["status"] } | null>(null);
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
    openDocument(id).then((result) => {
      if (cancelled) return;
      setLoaded({ id, status: result.status });
      if (result.status === "ok" && result.skippedTypes.length > 0) {
        toast.error(`Пропущены секции неизвестных блоков: ${result.skippedTypes.join(", ")}`);
      }
    });
    return () => {
      cancelled = true;
      useDocumentStore.getState().setDocument(null);
    };
  }, [id]);

  const isWide = useMediaQuery(`(min-width: ${EDITOR_MIN_WIDTH}px)`);
  useDocumentTitle(document?.meta.title);

  const status: Status = !isWide
    ? "narrow"
    : loaded?.id !== id
      ? "loading"
      : loaded.status === "ok"
        ? document
          ? "ready"
          : "not-found"
        : loaded.status;

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
