import { z } from "zod";

/** Схема формы входа. Из неё же выводится тип ILoginDto — один источник правды. */
export const loginSchema = z.object({
  email: z.email({ message: "Введите корректный email" }),
  password: z.string().min(6, { message: "Минимум 6 символов" }),
});
