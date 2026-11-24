import type { z } from "zod";
import type { loginSchema } from "@/schemas/auth.schema";

export interface IUser {
  id: number;
  name: string;
  email: string;
}

/** Тип выводится из zod-схемы формы */
export type ILoginDto = z.infer<typeof loginSchema>;

export interface IAuthResponse {
  accessToken: string;
  user: IUser;
}
