import { ArrowLeft, Redo2, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";
import BlockLibrary from "@/components/modules/Editor/BlockLibrary/BlockLibrary";
import Canvas from "@/components/modules/Editor/Canvas/Canvas";
import ViewportSwitcher from "@/components/modules/Editor/ViewportSwitcher/ViewportSwitcher";
import Button from "@/components/ui/Button/Button";
import PageLoader from "@/components/ui/PageLoader/PageLoader";
import { ROUTES } from "@/constants/routes";
import { useEditorPage } from "./useEditorPage";

/** Редактор. Инспектор, Outline, ⌘K и DnD подключаются на следующих этапах */
const EditorPage = () => {
  const { status, document, canUndo, canRedo, undo, redo } = useEditorPage();

  if (status === "loading") return <PageLoader />;

  if (status === "not-found" || !document) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-[var(--color-muted)]">Проект не найден</p>
        <Link to={ROUTES.HOME} className="text-[var(--color-primary)]">
          К списку проектов
        </Link>
      </section>
    );
  }

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--color-border)] px-3.5">
        <Link
          to={ROUTES.HOME}
          aria-label="К списку проектов"
          className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
        </Link>
        <h1 className="flex-1 truncate font-medium">{document.meta.title}</h1>
        <ViewportSwitcher />
        <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo} aria-label="Отменить">
          <Undo2 className="size-4" aria-hidden />
        </Button>
        <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo} aria-label="Повторить">
          <Redo2 className="size-4" aria-hidden />
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        <BlockLibrary />
        <Canvas />
      </div>
    </>
  );
};

export default EditorPage;
