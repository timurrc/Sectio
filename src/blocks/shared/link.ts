import { z } from "zod";

/** Схемы, которые можно ставить в href: остальные (javascript:, data: …) исполняют код */
const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel"]);

/** Ссылка в props блока: якорь, относительный путь или http(s), mailto, tel */
export const isSafeHref = (value: string) => {
  const scheme = /^\s*([a-z][a-z\d+.-]*):/i.exec(value)?.[1];
  return scheme === undefined || SAFE_SCHEMES.has(scheme.toLowerCase());
};

export const linkSchema = () =>
  z.string().refine(isSafeHref, {
    message: "Ссылка должна быть якорем (#…), путём (/…) или начинаться с https://, mailto:, tel:",
  });
