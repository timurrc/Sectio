import axios, { AxiosError, type AxiosInstance } from "axios";
import { ENV } from "@/constants/env";

/* ------------------------------------------------------------------ */
/*  Настройки                                                          */
/* ------------------------------------------------------------------ */

const BASE_URL = ENV.API_URL;

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
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ------------------------------------------------------------------ */
/*  RESPONSE: ошибки → ApiError                                        */
/*  Бэкенда у Sectio пока нет, поэтому токен и refresh убраны вместе    */
/*  с auth-стором. Вернёшь авторизацию — добавь interceptors сюда.     */
/* ------------------------------------------------------------------ */

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorBody>) => Promise.reject(toApiError(error)),
);
