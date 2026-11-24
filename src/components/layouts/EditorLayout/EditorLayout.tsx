import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation } from "react-router-dom";
import ErrorFallback from "@/components/ui/ErrorFallback/ErrorFallback";
import PageLoader from "@/components/ui/PageLoader/PageLoader";

/**
 * Полноэкранный каркас редактора. Без Container: панели занимают всю ширину окна.
 * Скролл живёт внутри панелей, сама страница не прокручивается.
 */
const EditorLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pathname]}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default EditorLayout;
