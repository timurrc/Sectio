import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser } from "@/types/auth.types";

interface AuthState {
  token: string | null;
  user: IUser | null;
  setAuth: (token: string, user: IUser) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

/**
 * Авторизация. Хранится в localStorage (persist), поэтому переживает перезагрузку.
 * В компонентах: const user = useAuthStore((s) => s.user) — всегда через селектор.
 * Вне React (axios): useAuthStore.getState().token
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      setToken: (token) => set({ token }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "auth" },
  ),
);

export const selectIsAuth = (state: AuthState) => Boolean(state.token);
