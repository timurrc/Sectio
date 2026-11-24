import { PREVIEW_URL, VIEWPORTS } from "@/constants/editor";
import { cn } from "@/utils/cn";
import { useCanvas } from "./useCanvas";

/**
 * Холст с iframe превью. Пока из библиотеки тянут блок, поверх iframe лежит прозрачная
 * зона сброса (иначе события мыши уходят в iframe). Линия показывает, куда встанет секция:
 * и для блока из библиотеки, и для секции, которую тянут прямо в превью.
 * Пустое состояние рисует сам iframe.
 */
const Canvas = () => {
  const { iframeRef, viewport, setDropRef, isDraggingBlock, isDraggingSection, dropLineY } =
    useCanvas();
  const widthClass = VIEWPORTS.find((item) => item.id === viewport)?.widthClass ?? "w-full";

  return (
    <div className="flex min-w-0 flex-1 justify-center overflow-auto bg-[var(--color-surface)] p-4">
      <div className={cn("relative h-full max-w-full transition-[width] duration-200", widthClass)}>
        <iframe
          ref={iframeRef}
          src={PREVIEW_URL}
          title="Превью лендинга"
          className="size-full rounded-xl border border-[var(--color-border)] bg-white shadow-sm"
        />
        {isDraggingBlock && (
          <div
            ref={setDropRef}
            data-testid="canvas-drop-zone"
            className="absolute inset-0 rounded-xl"
          />
        )}
        {(isDraggingBlock || isDraggingSection) && dropLineY !== null && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            <div
              data-testid="canvas-drop-line"
              className="absolute inset-x-3 h-1 -translate-y-1/2 rounded-full bg-[var(--color-primary)] shadow-[0_0_0_3px_var(--color-bg)]"
              style={{ top: Math.max(dropLineY, 2) }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
