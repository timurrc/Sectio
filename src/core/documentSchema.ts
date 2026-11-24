import { z } from "zod";
import { DEFAULT_THEME_DARK, DEFAULT_THEME_LIGHT } from "@/constants/theme";
import type { IDocument, IProjectMeta, IThemeTokens } from "@/types/document.types";

/**
 * Версия формата документа в IndexedDB. Меняешь форму IDocument — поднимаешь версию
 * и добавляешь шаг в MIGRATIONS, чтобы проекты прошлых версий продолжали открываться.
 */
export const DOCUMENT_VERSION = 1;

/** Шаг миграции: документ версии N → документ версии N + 1 (индекс = N) */
const MIGRATIONS: Record<number, (raw: Record<string, unknown>) => Record<string, unknown>> = {};

/** Токены темы: битое или пропавшее значение заменяется значением по умолчанию */
const tokensSchema = (defaults: IThemeTokens) =>
  z
    .object(
      Object.fromEntries(
        Object.entries(defaults).map(([key, value]) => [key, z.string().catch(value)]),
      ) as Record<keyof IThemeTokens, z.ZodCatch<z.ZodString>>,
    )
    .catch(defaults);

const sectionSchema = z.object({
  id: z.string().min(1),
  // Тип проверяет реестр блоков при открытии: неизвестный блок не ломает весь документ
  type: z.string(),
  variant: z.string().catch(""),
  theme: z.enum(["light", "dark"]).catch("light"),
  // Props проверяет schema блока (resolveSection), здесь только «что-то есть»
  props: z.unknown(),
});

/** Структура документа. Props секций здесь не проверяются — это делает блок */
export const documentSchema = z.object({
  id: z.string().min(1),
  meta: z
    .object({
      title: z.string().catch("Без названия"),
      description: z.string().catch(""),
    })
    .catch({ title: "Без названия", description: "" }),
  theme: z
    .object({ light: tokensSchema(DEFAULT_THEME_LIGHT), dark: tokensSchema(DEFAULT_THEME_DARK) })
    .catch({ light: DEFAULT_THEME_LIGHT, dark: DEFAULT_THEME_DARK }),
  sections: z.array(sectionSchema),
  updatedAt: z.number().catch(0),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Запись из хранилища → документ. Документ без версии считается версией 1.
 * null — запись из будущей версии или настолько битая, что открыть её нельзя.
 */
export const parseStoredDocument = (raw: unknown): IDocument | null => {
  if (!isRecord(raw)) return null;

  let version = typeof raw.version === "number" ? raw.version : 1;
  if (version > DOCUMENT_VERSION) return null;

  let current = raw;
  while (version < DOCUMENT_VERSION) {
    const migrate = MIGRATIONS[version];
    if (!migrate) return null;
    current = migrate(current);
    version += 1;
  }

  const parsed = documentSchema.safeParse(current);
  return parsed.success ? (parsed.data as IDocument) : null;
};

/** Строка списка проектов из записи хранилища. Битый документ тоже виден — его можно удалить */
export const toProjectMeta = (id: string, raw: unknown): IProjectMeta => {
  const meta = isRecord(raw) && isRecord(raw.meta) ? raw.meta : {};
  return {
    id,
    title: typeof meta.title === "string" && meta.title ? meta.title : "Без названия",
    updatedAt: isRecord(raw) && typeof raw.updatedAt === "number" ? raw.updatedAt : 0,
  };
};
