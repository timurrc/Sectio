import { z } from "zod";

/**
 * Переменные окружения проверяются при старте.
 * Если VITE_API_URL задан, но не URL — приложение сразу падает с понятной ошибкой,
 * а не ломается позже на первом запросе. Не задан — берётся значение по умолчанию.
 * В коде используем только ENV, не import.meta.env напрямую.
 */
const envSchema = z.object({
  // Бэкенда у Sectio нет, адрес нужен только инфраструктуре axios на будущее:
  // без него приложение должно запускаться (деплой на Vercel без переменных)
  VITE_API_URL: z
    .url({ message: "должен быть полным URL, например https://api.example.com" })
    .default("https://api.example.com"),
  VITE_USE_MOCK: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Неверные переменные окружения (.env):\n${details}`);
}

export const ENV = {
  API_URL: parsed.data.VITE_API_URL.replace(/\/$/, ""),
  USE_MOCK: parsed.data.VITE_USE_MOCK,
  IS_DEV: import.meta.env.DEV,
} as const;
