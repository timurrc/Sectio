import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter, type InitialEntry } from "react-router-dom";

interface Options extends Omit<RenderOptions, "wrapper"> {
  /** Строка или { pathname, state } — например, чтобы передать state.from */
  route?: InitialEntry;
}

/** Рендер с QueryClient и роутером — для модулей и страниц */
export const renderWithProviders = (
  ui: ReactElement,
  { route = "/", ...options }: Options = {},
) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};
