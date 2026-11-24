import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorFallback from "@/components/ui/ErrorFallback/ErrorFallback";
import { ENV } from "@/constants/env";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** MSW подключается только при VITE_USE_MOCK=true и не попадает в бандл иначе */
const enableMocking = async () => {
  if (!ENV.USE_MOCK) return;
  const { worker } = await import("@/mocks/browser");
  await worker.start({ onUnhandledFrame: "bypass" });
};

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
            <Toaster position="top-right" richColors />
          </BrowserRouter>
          {/* В production-сборку не попадает */}
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
});
