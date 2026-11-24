import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** Для Vitest. В тесте можно переопределить ответ: server.use(http.get(...)) */
export const server = setupServer(...handlers);
