import type { RequestHandler } from "msw";
import { ENV } from "@/constants/env";

/** Полный URL эндпоинта — тот же, что собирает axios из baseURL */
export const url = (path: string) => `${ENV.API_URL}${path}`;

/**
 * Мок-API. Одни и те же хендлеры работают в браузере (VITE_USE_MOCK=true)
 * и в Vitest (src/mocks/server.ts). Бэкенда у Sectio нет — хендлеры появятся вместе с ним.
 */
export const handlers: RequestHandler[] = [];
