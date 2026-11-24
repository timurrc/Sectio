import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { ENV } from "@/constants/env";
import { useAuthStore } from "@/store/auth.store";

// Свои флаги в конфиге запроса: api.get(url, { skipAuth: true })
declare module "axios" {
  interface AxiosRequestConfig {
    /** Не подставлять токен и не пытаться обновить его (логин, регистрация, публичные ручки) */
    skipAuth?: boolean;
    /** Служебный: запрос уже повторяли после refresh */
    _retry?: boolean;
  }
}

/* ------------------------------------------------------------------ */
/*  Настройки                                                          */
/* ------------------------------------------------------------------ */

const BASE_URL = ENV.API_URL;
const REFRESH_URL = "/auth/refresh"; // ожидается ответ { accessToken: string }

/* ------------------------------------------------------------------ */
/*  Токен — источник правды zustand (store/auth.store.ts)              */
/* ------------------------------------------------------------------ */

const getToken = () => useAuthStore.getState().token;

/* ------------------------------------------------------------------ */
/*  Единый формат ошибки                                               */
/* ------------------------------------------------------------------ */

export interface ApiError {
  /** HTTP-статус; null — ответа не было (сеть, таймаут, отмена) */
  status: number | null;
  message: string;
  /** Ошибки валидации по полям, если бэкенд их присылает: { email: ["Invalid"] } */
  fieldErrors?: Record<string, string[]>;
  data?: unknown;
}

interface ErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

const toApiError = (error: AxiosError<ErrorBody>): ApiError => {
  if (axios.isCancel(error)) {
    return { status: null, message: "Запрос отменён" };
  }
  if (error.code === "ECONNABORTED") {
    return { status: null, message: "Сервер не ответил вовремя" };
  }
  if (!error.response) {
    return { status: null, message: "Нет соединения с сервером" };
  }

  const { status, data } = error.response;
  return {
    status,
    message: data?.message ?? error.message,
    fieldErrors: data?.errors,
    data,
  };
};

/** Проверка в catch: if (isApiError(e)) e.status ... */
export const isApiError = (value: unknown): value is ApiError =>
  typeof value === "object" && value !== null && "status" in value && "message" in value;

/* ------------------------------------------------------------------ */
/*  Instance                                                           */
/* ------------------------------------------------------------------ */

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  withCredentials: true, // refresh-токен обычно лежит в httpOnly cookie
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ------------------------------------------------------------------ */
/*  REQUEST: подставляем токен                                         */
/* ------------------------------------------------------------------ */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ------------------------------------------------------------------ */
/*  REFRESH: один запрос на обновление, даже если упало 10 запросов    */
/* ------------------------------------------------------------------ */

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
  // Отдельный axios без interceptors, чтобы не уйти в бесконечный цикл
  refreshPromise ??= axios
    .post<{ accessToken: string }>(REFRESH_URL, null, { baseURL: BASE_URL, withCredentials: true })
    .then(({ data }) => {
      useAuthStore.getState().setToken(data.accessToken);
      return data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// После logout ProtectedRoute сам уведёт на /login: он подписан на токен в сторе
const logout = () => useAuthStore.getState().logout();

/* ------------------------------------------------------------------ */
/*  RESPONSE: 401 → refresh → повтор; остальные ошибки → ApiError      */
/* ------------------------------------------------------------------ */

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorBody>) => {
    const original = error.config;
    const canRefresh =
      error.response?.status === 401 && original && !original._retry && !original.skipAuth;

    if (canRefresh) {
      original._retry = true;
      try {
        const token = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        logout();
      }
    }

    return Promise.reject(toApiError(error));
  },
);
