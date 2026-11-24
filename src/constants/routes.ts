export const ROUTES = {
  HOME: "/",
  EDITOR: "/editor/:id",
} as const;

/** Подставляет параметры в путь: buildPath(ROUTES.EDITOR, { id: "abc" }) → "/editor/abc" */
export const buildPath = (path: string, params: Record<string, string | number>) =>
  Object.entries(params).reduce((acc, [key, value]) => acc.replace(`:${key}`, String(value)), path);
