import type { IThemeTokens } from "@/types/document.types";

export const DEFAULT_THEME_LIGHT: IThemeTokens = {
  primary: "#4f46e5",
  primaryHover: "#4338ca",
  text: "#0f172a",
  muted: "#64748b",
  bg: "#ffffff",
  surface: "#f8fafc",
  border: "#e2e8f0",
  radius: "0.75rem",
  font: "Inter, system-ui, sans-serif",
};

export const DEFAULT_THEME_DARK: IThemeTokens = {
  primary: "#818cf8",
  primaryHover: "#a5b4fc",
  text: "#f1f5f9",
  muted: "#94a3b8",
  bg: "#0b1120",
  surface: "#111a2e",
  border: "#1e293b",
  radius: "0.75rem",
  font: "Inter, system-ui, sans-serif",
};

/** Цвета, которые правятся в редакторе темы. primaryHover подбирается из primary автоматически */
export const THEME_COLOR_FIELDS: { key: keyof IThemeTokens; label: string }[] = [
  { key: "primary", label: "Акцент" },
  { key: "text", label: "Текст" },
  { key: "muted", label: "Второстепенный текст" },
  { key: "bg", label: "Фон" },
  { key: "surface", label: "Фон карточек" },
  { key: "border", label: "Границы" },
];

export const RADIUS_PRESETS = [
  { id: "0rem", label: "Нет" },
  { id: "0.375rem", label: "S" },
  { id: "0.75rem", label: "M" },
  { id: "1.25rem", label: "L" },
];

/** Системные стеки: превью не грузит веб-шрифты, подключение шрифта — задача экспорта */
export const FONT_PRESETS = [
  { id: "Inter, system-ui, sans-serif", label: "Inter / системный" },
  { id: "system-ui, sans-serif", label: "Системный" },
  { id: "Georgia, 'Times New Roman', serif", label: "С засечками" },
  { id: "ui-monospace, 'SF Mono', Menlo, monospace", label: "Моноширинный" },
];
