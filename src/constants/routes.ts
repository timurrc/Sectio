export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  PROFILE: "/profile",
  FOOD: "/food/:id",
} as const;

/** Подставляет параметры в путь: buildPath(ROUTES.FOOD, { id: 5 }) → "/food/5" */
export const buildPath = (path: string, params: Record<string, string | number>) =>
  Object.entries(params).reduce((acc, [key, value]) => acc.replace(`:${key}`, String(value)), path);
