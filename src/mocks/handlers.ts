import { delay, http, HttpResponse } from "msw";
import { ENV } from "@/constants/env";
import { MOCK_FOOD, MOCK_TOKEN, MOCK_USER } from "@/constants/mock";
import type { IAuthResponse, ILoginDto } from "@/types/auth.types";

/** Полный URL эндпоинта — тот же, что собирает axios из baseURL */
const url = (path: string) => `${ENV.API_URL}${path}`;

/**
 * Мок-API. Одни и те же хендлеры работают в браузере (VITE_USE_MOCK=true)
 * и в Vitest (src/mocks/server.ts). Новый эндпоинт в services → хендлер здесь.
 */
export const handlers = [
  http.get(url("/food"), async () => {
    await delay();
    return HttpResponse.json(MOCK_FOOD);
  }),

  http.get(url("/food/:id"), async ({ params }) => {
    await delay();
    const item = MOCK_FOOD.find((food) => food.id === Number(params.id));
    return item
      ? HttpResponse.json(item)
      : HttpResponse.json({ message: "Не найдено" }, { status: 404 });
  }),

  http.post(url("/auth/login"), async ({ request }) => {
    await delay();
    const { password } = (await request.json()) as ILoginDto;

    if (password === "wrongpass") {
      return HttpResponse.json(
        { message: "Неверный email или пароль", errors: { password: ["Неверный пароль"] } },
        { status: 422 },
      );
    }

    return HttpResponse.json<IAuthResponse>({ accessToken: MOCK_TOKEN, user: MOCK_USER });
  }),

  http.post(url("/auth/refresh"), () => HttpResponse.json({ accessToken: MOCK_TOKEN })),
];
