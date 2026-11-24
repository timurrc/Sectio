import type { IThemeTokens } from "@/types/document.types";

/** Значение токена попадает в <style>, поэтому вырезаем всё, что могло бы выйти из объявления */
const sanitize = (value: string) => value.replace(/[{};<>\\\n\r]/g, "").trim();

const toVars = (tokens: IThemeTokens) =>
  [
    ["--color-primary", tokens.primary],
    ["--color-primary-hover", tokens.primaryHover],
    ["--color-text", tokens.text],
    ["--color-muted", tokens.muted],
    ["--color-bg", tokens.bg],
    ["--color-surface", tokens.surface],
    ["--color-border", tokens.border],
    ["--radius", tokens.radius],
    ["--font", tokens.font],
  ]
    .map(([name, value]) => `  ${name}: ${sanitize(value)};`)
    .join("\n");

/**
 * Токены темы → CSS-переменные. Light — на :root, dark — на .dark (класс на обёртке секции).
 * Используется и в превью (<style>), и в экспорте (index.css).
 */
export const themeToCss = (theme: { light: IThemeTokens; dark: IThemeTokens }): string =>
  `:root {\n${toVars(theme.light)}\n}\n\n.dark {\n${toVars(theme.dark)}\n}\n`;
