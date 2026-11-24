import { PREVIEW_URL, VIEWPORTS } from "@/constants/editor";
import { useCanvas } from "./useCanvas";

/** Пустое состояние («Добавьте первую секцию…») рисует сам iframe превью */
const Canvas = () => {
  const { iframeRef, viewport } = useCanvas();
  const widthClass = VIEWPORTS.find((item) => item.id === viewport)?.widthClass ?? "w-full";

  return (
    <div className="flex min-w-0 flex-1 justify-center overflow-auto bg-[var(--color-surface)] p-4">
      <iframe
        ref={iframeRef}
        src={PREVIEW_URL}
        title="Превью лендинга"
        className={`h-full max-w-full rounded-xl border border-[var(--color-border)] bg-white shadow-sm transition-[width] duration-200 ${widthClass}`}
      />
    </div>
  );
};

export default Canvas;
