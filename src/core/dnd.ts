import type { ISectionRect } from "./protocol";
import type { BlockType } from "@/types/document.types";

/** Данные перетаскиваемого элемента (data у dnd-kit) */
export type DragData = { kind: "library"; type: BlockType } | { kind: "section" };

export const CANVAS_DROP_ID = "canvas";

/**
 * Позиция вставки по вертикали курсора в iframe: секция встаёт перед первой,
 * чья середина ниже курсора. Возвращает индекс и y линии-индикатора.
 */
export const getDropIndex = (
  rects: ISectionRect[],
  y: number,
): { index: number; lineY: number } => {
  const index = rects.findIndex((rect) => y < rect.top + rect.height / 2);
  if (index !== -1) return { index, lineY: rects[index].top };
  const last = rects.at(-1);
  return { index: rects.length, lineY: last ? last.top + last.height : 0 };
};

/**
 * Перенос секции, которую тянут прямо в превью. Индекс вставки (перед какой секцией)
 * переводится в итоговую позицию для moveSection. null — секция встанет туда же, где была.
 */
export const getSectionMove = (
  rects: ISectionRect[],
  id: string,
  y: number,
): { toIndex: number; lineY: number } | null => {
  const from = rects.findIndex((rect) => rect.id === id);
  if (from === -1) return null;
  const { index, lineY } = getDropIndex(rects, y);
  const toIndex = index > from ? index - 1 : index;
  return toIndex === from ? null : { toIndex, lineY };
};

/** Зона у верхнего и нижнего края холста, где превью прокручивается само (px) */
export const AUTO_SCROLL_EDGE = 56;
/** Скорость прокрутки у самого края (px за кадр) */
export const AUTO_SCROLL_MAX = 18;

/**
 * Автопрокрутка при перетаскивании: чем ближе курсор к краю (или дальше за ним),
 * тем быстрее. Отрицательное значение — вверх, 0 — курсор не у края.
 */
export const getAutoScrollDelta = (y: number, height: number): number => {
  const speed = (distance: number) =>
    Math.round(AUTO_SCROLL_MAX * Math.min(1, (AUTO_SCROLL_EDGE - distance) / AUTO_SCROLL_EDGE));
  if (y < AUTO_SCROLL_EDGE) return -speed(Math.max(y, 0));
  if (y > height - AUTO_SCROLL_EDGE) return speed(Math.max(height - y, 0));
  return 0;
};
