import { ArrowLeft, Redo2, SearchX, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";
import BlockLibrary from "@/components/modules/Editor/BlockLibrary/BlockLibrary";
import Canvas from "@/components/modules/Editor/Canvas/Canvas";
import ViewportSwitcher from "@/components/modules/Editor/ViewportSwitcher/ViewportSwitcher";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
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
      <section className="flex flex-1 items-center justify-center">
        <EmptyState
          icon={SearchX}
          title="Проект не найден"
          description="Возможно, он был удалён или открыт в другом браузере."
          action={
            <Link
              to={ROUTES.HOME}
              className="inline-flex h-10 items-center rounded-full bg-[var(--color-primary)] px-5 font-medium text-white hover:bg-[var(--color-primary-hover)]"
            >
              К списку проектов
            </Link>
          }
        />
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
        <h1 className="flex-1 truncate font-semibold">{document.meta.title}</h1>
        <ViewportSwitcher />
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Отменить"
        >
          <Undo2 className="size-4" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Повторить"
        >
          <Redo2 className="size-4" aria-hidden />
        </Button>
        {/* Место под главное действие; экспорт подключается на этапе 3 */}
        <Button size="sm" disabled title="Экспорт появится на этапе 3">
          Экспорт
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
