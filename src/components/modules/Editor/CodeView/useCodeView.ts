import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type IGeneratedProject, generateProject } from "@/codegen/generateProject";
import { EXPORT_PATHS } from "@/constants/export";
import { useDebounce } from "@/hooks/useDebounce";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";

/** Пауза перед перегенерацией: печать в инспекторе не должна дёргать Babel на каждый символ */
const REGENERATE_DELAY = 300;

export const useCodeView = () => {
  const document = useDocumentStore((state) => state.document);
  const selectedId = useEditorStore((state) => state.selectedId);
  const debouncedDocument = useDebounce(document, REGENERATE_DELAY);

  const [project, setProject] = useState<IGeneratedProject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pickedPath, setPickedPath] = useState<string | null>(null);

  useEffect(() => {
    if (!debouncedDocument) return;
    let cancelled = false;
    generateProject(debouncedDocument)
      .then((result) => {
        if (cancelled) return;
        setProject(result);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : String(reason));
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedDocument]);

  // Выбор секции на холсте или в Outline открывает её файл; клик по дереву — любой другой
  const [lastSelectedId, setLastSelectedId] = useState(selectedId);
  if (selectedId !== lastSelectedId) {
    setLastSelectedId(selectedId);
    setPickedPath(null);
  }

  const files = project?.files ?? {};
  const sectionPath = selectedId ? project?.sectionPaths[selectedId] : undefined;
  const candidate = pickedPath ?? sectionPath ?? EXPORT_PATHS.app;
  const activePath = candidate in files ? candidate : EXPORT_PATHS.app;
  const code = files[activePath] ?? "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Код скопирован");
    } catch {
      toast.error("Не удалось скопировать: браузер не дал доступ к буферу обмена");
    }
  };

  return {
    paths: Object.keys(files),
    activePath,
    code,
    isLoading: !project && !error,
    error,
    openFile: setPickedPath,
    copy,
  };
};
