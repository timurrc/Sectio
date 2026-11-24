import { z } from "zod";

/**
 * Переменные окружения проверяются при старте.
 * Нет VITE_API_URL или он не URL — приложение сразу падает с понятной ошибкой,
 * а не ломается позже на первом запросе.
 * В коде используем только ENV, не import.meta.env напрямую.
 */
const envSchema = z.object({
  VITE_API_URL: z.url({ message: "должен быть полным URL, например https://api.example.com" }),
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
