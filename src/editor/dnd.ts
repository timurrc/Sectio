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
