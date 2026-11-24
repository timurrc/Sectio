import { z } from "zod";

/**
 * Разбор zod-схемы блока в дерево полей инспектора.
 * Инспектор не знает про конкретные блоки: новый блок получает форму автоматически,
 * а подписи берёт из .meta({ label }) в своей схеме.
 */

export type FieldPath = (string | number)[];

interface IFieldBase {
  key: string;
  label: string;
}

export type FieldNode =
  | (IFieldBase & { kind: "text"; multiline: boolean; required: boolean })
  | (IFieldBase & { kind: "number" })
  | (IFieldBase & { kind: "boolean" })
  | (IFieldBase & { kind: "object"; fields: FieldNode[] })
  | (IFieldBase & {
      kind: "list";
      itemLabel: string;
      item: FieldNode;
      min: number;
      max: number;
    })
  | (IFieldBase & { kind: "unsupported" });

/** Обёртки, которые для формы ничего не меняют */
const unwrap = (schema: z.ZodType): z.ZodType => {
  if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault
  ) {
    return unwrap(schema.unwrap() as z.ZodType);
  }
  return schema;
};

const humanize = (key: string) =>
  key
    ? key.charAt(0).toUpperCase() +
      key
        .slice(1)
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
    : "";

const lengthCheck = (schema: z.ZodArray, check: "min_length" | "max_length") => {
  for (const item of schema._zod.def.checks ?? []) {
    const def = item._zod.def as { check: string; minimum?: number; maximum?: number };
    if (def.check === check) return check === "min_length" ? def.minimum : def.maximum;
  }
  return undefined;
};

export const toFieldNode = (raw: z.ZodType, key = ""): FieldNode => {
  const meta = raw.meta() ?? {};
  const schema = unwrap(raw);
  const base = { key, label: meta.label ?? unwrap(raw).meta()?.label ?? humanize(key) };

  if (schema instanceof z.ZodString) {
    return {
      ...base,
      kind: "text",
      multiline: Boolean(meta.multiline ?? schema.meta()?.multiline),
      required: (schema.minLength ?? 0) > 0,
    };
  }
  if (schema instanceof z.ZodNumber) return { ...base, kind: "number" };
  if (schema instanceof z.ZodBoolean) return { ...base, kind: "boolean" };
  if (schema instanceof z.ZodObject) {
    return {
      ...base,
      kind: "object",
      fields: Object.entries(schema.shape).map(([name, child]) =>
        toFieldNode(child as z.ZodType, name),
      ),
    };
  }
  if (schema instanceof z.ZodArray) {
    const item = toFieldNode(schema.element as z.ZodType);
    return {
      ...base,
      kind: "list",
      itemLabel: meta.itemLabel ?? item.label ?? "Элемент",
      item,
      min: lengthCheck(schema, "min_length") ?? 0,
      max: lengthCheck(schema, "max_length") ?? Infinity,
    };
  }
  return { ...base, kind: "unsupported" };
};

/** Поля верхнего уровня схемы блока (схема блока — всегда объект) */
export const getSchemaFields = (schema: z.ZodType): FieldNode[] => {
  const node = toFieldNode(schema);
  return node.kind === "object" ? node.fields : [];
};

/** Пустое значение для поля: используется, когда в списке ещё нет элемента-образца */
export const emptyValue = (node: FieldNode): unknown => {
  switch (node.kind) {
    case "text":
      return node.required ? node.label : "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "object":
      return Object.fromEntries(node.fields.map((field) => [field.key, emptyValue(field)]));
    case "list":
      return Array.from({ length: node.min }, () => emptyValue(node.item));
    default:
      return undefined;
  }
};

export const getAt = (value: unknown, path: FieldPath): unknown =>
  path.reduce<unknown>(
    (current, key) =>
      current !== null && typeof current === "object"
        ? (current as Record<string | number, unknown>)[key]
        : undefined,
    value,
  );

/** Иммутабельная запись по пути: копируются только объекты на пути */
export const setAt = (value: unknown, path: FieldPath, next: unknown): unknown => {
  if (path.length === 0) return next;
  const [head, ...rest] = path;
  const container = Array.isArray(value)
    ? [...value]
    : { ...((value ?? {}) as Record<string, unknown>) };
  const child = (container as Record<string | number, unknown>)[head];
  (container as Record<string | number, unknown>)[head] = setAt(child, rest, next);
  return container;
};

export const pathKey = (path: FieldPath) => path.join(".");

/** Ошибки валидации по пути поля, человеческим языком */
export const issuesToErrors = (issues: z.core.$ZodIssue[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = pathKey(issue.path as FieldPath);
    if (errors[key]) continue;
    errors[key] = issueMessage(issue);
  }
  return errors;
};

const issueMessage = (issue: z.core.$ZodIssue): string => {
  if (issue.code === "too_small") {
    if (issue.origin === "string") return "Заполните поле";
    if (issue.origin === "array") return `Нужно хотя бы ${issue.minimum}`;
  }
  if (issue.code === "too_big" && issue.origin === "array") return `Не больше ${issue.maximum}`;
  if (issue.code === "invalid_type") return "Неверный формат";
  return issue.message;
};
