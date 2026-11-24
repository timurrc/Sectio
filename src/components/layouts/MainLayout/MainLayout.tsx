import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation } from "react-router-dom";
import Container from "@/components/layouts/Container/Container";
import Header from "@/components/modules/Header/Header";
import ErrorFallback from "@/components/ui/ErrorFallback/ErrorFallback";
import PageLoader from "@/components/ui/PageLoader/PageLoader";

/**
 * Общий каркас страниц: Header + контент в Container.
 * ErrorBoundary ловит падение страницы (Header остаётся), сбрасывается при смене роута.
 * Suspense показывает лоадер, пока грузится lazy-страница.
 */
const MainLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pathname]}>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Container>
      </main>
    </div>
  );
};

export default MainLayout;
