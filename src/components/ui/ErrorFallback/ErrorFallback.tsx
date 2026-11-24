import { TriangleAlert } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import Button from "@/components/ui/Button/Button";

/** Экран ошибки для react-error-boundary вместо белой страницы */
const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const message = error instanceof Error ? error.message : "Неизвестная ошибка";

  return (
    <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
      <TriangleAlert className="size-10 text-[var(--color-danger)]" aria-hidden />
      <h2 className="text-2xl font-medium">Что-то пошло не так</h2>
      <p className="max-w-md text-[var(--color-muted)]">{message}</p>
      <Button variant="outline" onClick={resetErrorBoundary}>
        Попробовать снова
      </Button>
    </div>
  );
};

export default ErrorFallback;
