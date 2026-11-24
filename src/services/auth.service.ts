import { api } from "@/api/axios.api";
import type { IAuthResponse, ILoginDto } from "@/types/auth.types";

export const AuthService = {
  login: async (dto: ILoginDto) => {
    const { data } = await api.post<IAuthResponse>("/auth/login", dto, { skipAuth: true });
    return data;
  },
};
