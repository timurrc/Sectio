import { getAutoScrollDelta } from "@/editor/dnd";
import type { PreviewToParent } from "@/editor/protocol";
import { sectionIdFrom } from "./sectionDom";

/** На сколько px нужно сдвинуть зажатый указатель, чтобы клик стал перетаскиванием */
export const DRAG_THRESHOLD = 6;

/** Поля ввода внутри лендинга не перетаскиваются: там выделяют текст */
const EDITABLE = "input, textarea, select, [contenteditable]";

type Send = (message: PreviewToParent) => void;

/**
 * Перетаскивание секции прямо в превью. iframe не меняет порядок сам: он сообщает родителю,
 * где курсор (section:drag), и где секцию отпустили (section:drop). Индекс считает и модель
 * меняет редактор. Здесь только жест, автопрокрутка у края и data-атрибуты для preview.css.
 * Возвращает функцию отписки.
 */
export const startSectionDrag = (send: Send, win: Window = window): (() => void) => {
  const root = win.document.documentElement;
  let press: { id: string; x: number; y: number; pointerId: number } | null = null;
  let draggingId: string | null = null;
  let lastY = 0;
  let frame = 0;
  // Клик после отпускания не должен выбирать секцию под курсором ещё раз
  let suppressClick = false;

  const sectionElement = (id: string) =>
    win.document.querySelector<HTMLElement>(`[data-section-id="${CSS.escape(id)}"]`);

  const autoScroll = () => {
    const dy = getAutoScrollDelta(lastY, win.innerHeight);
    if (dy !== 0 && draggingId) {
      win.scrollBy(0, dy);
      send({ type: "section:drag", id: draggingId, y: lastY });
    }
    frame = win.requestAnimationFrame(autoScroll);
  };

  const finish = () => {
    if (draggingId) sectionElement(draggingId)?.removeAttribute("data-drag-source");
    delete root.dataset.dragging;
    win.cancelAnimationFrame(frame);
    press = null;
    draggingId = null;
  };

  const cancel = () => {
    if (draggingId) send({ type: "section:drag-cancel" });
    finish();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !(event.target instanceof Element)) return;
    if (event.target.closest(EDITABLE)) return;
    const id = sectionIdFrom(event.target);
    if (!id) return;
    press = { id, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!press || event.pointerId !== press.pointerId) return;
    lastY = event.clientY;

    if (!draggingId) {
      const distance = Math.hypot(event.clientX - press.x, event.clientY - press.y);
      if (distance < DRAG_THRESHOLD) return;
      draggingId = press.id;
      root.dataset.dragging = "";
      sectionElement(draggingId)?.setAttribute("data-drag-source", "");
      win.getSelection()?.removeAllRanges();
      // Указатель продолжает приходить в iframe, даже когда ушёл за его край
      if (event.target instanceof Element) event.target.setPointerCapture?.(event.pointerId);
      frame = win.requestAnimationFrame(autoScroll);
    }

    send({ type: "section:drag", id: draggingId, y: lastY });
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!press || event.pointerId !== press.pointerId) return;
    if (draggingId) {
      send({ type: "section:drop", id: draggingId, y: event.clientY });
      suppressClick = true;
    }
    finish();
  };

  const onClick = (event: MouseEvent) => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  // Esc отменяет перетаскивание и не уходит в редактор как «снять выделение»
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !draggingId) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    cancel();
  };

  // Нативный drag ссылок и картинок перехватил бы указатель
  const onNativeDragStart = (event: DragEvent) => event.preventDefault();

  win.addEventListener("pointerdown", onPointerDown);
  win.addEventListener("pointermove", onPointerMove);
  win.addEventListener("pointerup", onPointerUp);
  win.addEventListener("pointercancel", cancel);
  win.addEventListener("blur", cancel);
  win.addEventListener("click", onClick, true);
  win.addEventListener("keydown", onKeyDown, true);
  win.addEventListener("dragstart", onNativeDragStart);

  return () => {
    cancel();
    win.removeEventListener("pointerdown", onPointerDown);
    win.removeEventListener("pointermove", onPointerMove);
    win.removeEventListener("pointerup", onPointerUp);
    win.removeEventListener("pointercancel", cancel);
    win.removeEventListener("blur", cancel);
    win.removeEventListener("click", onClick, true);
    win.removeEventListener("keydown", onKeyDown, true);
    win.removeEventListener("dragstart", onNativeDragStart);
  };
};
