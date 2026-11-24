import { Copy, TriangleAlert } from "lucide-react";
import { lazy, Suspense } from "react";
import Button from "@/components/ui/Button/Button";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import PageLoader from "@/components/ui/PageLoader/PageLoader";
import FileTree from "./FileTree";
import { useCodeView } from "./useCodeView";

const CodeEditor = lazy(() => import("./CodeEditor"));

/** Вкладка «Код»: файлы экспортируемого проекта, только чтение */
const CodeView = () => {
  const { paths, activePath, code, isLoading, error, openFile, copy } = useCodeView();

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          icon={TriangleAlert}
          title="Не удалось собрать код"
          description={error}
          action={
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Перезагрузить страницу
            </Button>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1">
      <nav className="w-56 shrink-0 overflow-y-auto border-r border-[var(--color-border)]">
        <FileTree paths={paths} activePath={activePath} onOpen={openFile} />
      </nav>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-10 shrink-0 items-center gap-3 border-b border-[var(--color-border)] pr-2 pl-4">
          <span className="flex-1 truncate font-mono text-sm text-[var(--color-muted)]">
            {activePath}
          </span>
          <Button variant="ghost" size="sm" onClick={copy}>
            <Copy className="size-4" aria-hidden />
            Копировать
          </Button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Suspense fallback={<PageLoader />}>
            <CodeEditor path={activePath} code={code} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CodeView;
