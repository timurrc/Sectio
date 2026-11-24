import { clampChroma, formatHex, oklch, wcagContrast } from "culori";
import type { SectionTheme } from "@/types/document.types";

const HEX_RE = /^#[0-9a-f]{6}$/i;

export const isHexColor = (value: string) => HEX_RE.test(value);

/** Минимальный контраст текста по WCAG AA */
export const MIN_CONTRAST = 4.5;

/**
 * Цвет наведения из primary: в светлой теме темнее, в тёмной — светлее.
 * Считаем в OKLCH, чтобы шаг яркости ощущался одинаково для любого оттенка.
 */
export const deriveHover = (primary: string, theme: SectionTheme): string => {
  const color = oklch(primary);
  if (!color) return primary;
  const step = theme === "light" ? -0.07 : 0.07;
  const next = { ...color, l: Math.min(Math.max(color.l + step, 0), 1) };
  return formatHex(clampChroma(next, "oklch")) ?? primary;
};

/** Контраст двух цветов (1–21). Для нераспознанных цветов — 21, чтобы не пугать предупреждением */
export const contrast = (a: string, b: string): number => {
  if (!oklch(a) || !oklch(b)) return 21;
  return wcagContrast(a, b);
};
