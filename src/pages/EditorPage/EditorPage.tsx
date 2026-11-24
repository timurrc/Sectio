import { ArrowLeft, Download, ExternalLink, Redo2, Search, SearchX, Undo2 } from "lucide-react";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Canvas from "@/components/modules/Editor/Canvas/Canvas";
import CodeView from "@/components/modules/Editor/CodeView/CodeView";
import EditorDnd from "@/components/modules/Editor/EditorDnd/EditorDnd";
import Inspector from "@/components/modules/Editor/Inspector/Inspector";
import LeftPanel from "@/components/modules/Editor/LeftPanel/LeftPanel";
import ThemeEditor from "@/components/modules/Editor/ThemeEditor/ThemeEditor";
import ViewportSwitcher from "@/components/modules/Editor/ViewportSwitcher/ViewportSwitcher";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import Button from "@/components/ui/Button/Button";
import PageLoader from "@/components/ui/PageLoader/PageLoader";
import SegmentedControl from "@/components/ui/SegmentedControl/SegmentedControl";
import { ROUTES } from "@/constants/routes";
import { HOTKEY_HINTS } from "@/editor/hotkeys";
import { EDITOR_TABS, useEditorPage } from "./useEditorPage";

// fuse.js и сама палитра грузятся при первом ⌘K
const CommandPalette = lazy(
  () => import("@/components/modules/Editor/CommandPalette/CommandPalette"),
);

/** Редактор: библиотека и структура слева, холст, справа свойства секции или настройки страницы */
const EditorPage = () => {
  const {
    status,
    document,
    selectedSection,
    tab,
    setTab,
    exporting,
    downloadZip,
    openStackBlitz,
    canUndo,
    canRedo,
    undo,
    redo,
    paletteOpen,
    openPalette,
  } = useEditorPage();

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
        <SegmentedControl
          label="Режим"
          value={tab}
          items={EDITOR_TABS}
          onChange={setTab}
          className="w-48 shrink-0"
        />
        {tab === "preview" && <ViewportSwitcher />}
        <Button
          variant="outline"
          size="sm"
          onClick={openPalette}
          aria-keyshortcuts="Meta+K Control+K"
          title={`Блоки, действия и шаблоны (${HOTKEY_HINTS.palette})`}
        >
          <Search className="size-4" aria-hidden />
          <kbd className="font-sans text-[var(--color-muted)]">{HOTKEY_HINTS.palette}</kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Отменить"
          title={`Отменить (${HOTKEY_HINTS.undo})`}
        >
          <Undo2 className="size-4" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Повторить"
          title={`Повторить (${HOTKEY_HINTS.redo})`}
        >
          <Redo2 className="size-4" aria-hidden />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={openStackBlitz}
          isLoading={exporting === "stackblitz"}
          disabled={exporting !== null}
          title="Открыть проект в StackBlitz в новой вкладке"
        >
          {exporting !== "stackblitz" && <ExternalLink className="size-4" aria-hidden />}
          StackBlitz
        </Button>
        <Button
          size="sm"
          onClick={downloadZip}
          isLoading={exporting === "zip"}
          disabled={exporting !== null}
          title="Скачать проект Vite + React + Tailwind zip-архивом"
        >
          {exporting !== "zip" && <Download className="size-4" aria-hidden />}
          Экспорт
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        <EditorDnd>
          <LeftPanel />
          {tab === "preview" ? <Canvas /> : <CodeView />}
        </EditorDnd>
        <aside
          aria-label={selectedSection ? "Свойства секции" : "Настройки страницы"}
          className="w-80 shrink-0 overflow-y-auto border-l border-[var(--color-border)]"
        >
          {selectedSection ? (
            <Inspector key={selectedSection.id} section={selectedSection} />
          ) : (
            <ThemeEditor />
          )}
        </aside>
      </div>

      {paletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      )}
    </>
  );
};

export default EditorPage;
