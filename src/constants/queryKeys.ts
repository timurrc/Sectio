/** Ключи TanStack Query. Все ключи только отсюда, чтобы инвалидация была предсказуемой. */
export const QUERY_KEYS = {
  food: {
    all: ["food"] as const,
    byId: (id: number) => ["food", id] as const,
  },
};
