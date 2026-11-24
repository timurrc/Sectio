import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { selectIsAuth, useAuthStore } from "@/store/auth.store";

interface ProtectedRouteProps {
  /** guest — только для неавторизованных (логин, регистрация) */
  mode?: "private" | "guest";
}

/**
 * Обёртка для группы роутов.
 * private: нет токена → /login, после входа вернёт на исходную страницу (state.from).
 * guest:   есть токен → на главную.
 */
const ProtectedRoute = ({ mode = "private" }: ProtectedRouteProps) => {
  const isAuth = useAuthStore(selectIsAuth);
  const location = useLocation();

  if (mode === "private" && !isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  if (mode === "guest" && isAuth) {
    // Сразу после логина guard срабатывает раньше navigate() в хуке —
    // поэтому сам уводит туда, откуда пользователя отправили на /login
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
