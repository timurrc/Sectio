import { useState } from "react";
import { contrast, deriveHover, MIN_CONTRAST } from "@/core/color";
import { useDocumentStore } from "@/store/document.store";
import type { IThemeTokens, SectionTheme } from "@/types/document.types";

export interface IContrastWarning {
  label: string;
  ratio: number;
}

export const getContrastWarnings = (tokens: IThemeTokens): IContrastWarning[] =>
  [
    { label: "Текст на фоне", ratio: contrast(tokens.text, tokens.bg) },
    { label: "Текст на кнопках", ratio: contrast(tokens.bg, tokens.primary) },
    { label: "Текст на карточках", ratio: contrast(tokens.text, tokens.surface) },
  ].filter((item) => item.ratio < MIN_CONTRAST);

export const useThemeEditor = () => {
  const [mode, setMode] = useState<SectionTheme>("light");
  const meta = useDocumentStore((state) => state.document?.meta);
  const theme = useDocumentStore((state) => state.document?.theme);
  const updateMeta = useDocumentStore((state) => state.updateMeta);
  const updateThemeTokens = useDocumentStore((state) => state.updateThemeTokens);

  const tokens = theme?.[mode];

  const setToken = (key: keyof IThemeTokens, value: string) =>
    updateThemeTokens(
      mode,
      // Цвет наведения следует за акцентом, чтобы кнопки не «прыгали» в чужой оттенок
      key === "primary"
        ? { primary: value, primaryHover: deriveHover(value, mode) }
        : { [key]: value },
    );

  return {
    mode,
    setMode,
    meta,
    tokens,
    warnings: tokens ? getContrastWarnings(tokens) : [],
    updateMeta,
    setToken,
  };
};
