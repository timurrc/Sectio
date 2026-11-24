import { LoaderCircle } from "lucide-react";

/** Fallback для Suspense, пока грузится lazy-страница */
const PageLoader = () => {
  return (
    <div className="flex justify-center py-16" aria-label="Загрузка" role="status">
      <LoaderCircle className="size-8 animate-spin text-[var(--color-primary)]" aria-hidden />
    </div>
  );
};

export default PageLoader;
