import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { renderWithProviders } from "@/test/renderWithProviders";
import ProtectedRoute from "./ProtectedRoute";

const renderRoutes = () =>
  renderWithProviders(
    <Routes>
      <Route path={ROUTES.LOGIN} element={<p>login</p>} />
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.PROFILE} element={<p>profile</p>} />
      </Route>
    </Routes>,
    { route: ROUTES.PROFILE },
  );

describe("ProtectedRoute", () => {
  beforeEach(() => useAuthStore.getState().logout());

  it("без токена уводит на логин", () => {
    renderRoutes();
    expect(screen.getByText("login")).toBeInTheDocument();
  });

  it("гостевой роут после входа уводит на state.from", () => {
    useAuthStore.getState().setToken("token");
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute mode="guest" />}>
          <Route path={ROUTES.LOGIN} element={<p>login</p>} />
        </Route>
        <Route path={ROUTES.PROFILE} element={<p>profile</p>} />
      </Routes>,
      { route: { pathname: ROUTES.LOGIN, state: { from: ROUTES.PROFILE } } },
    );
    expect(screen.getByText("profile")).toBeInTheDocument();
  });

  it("с токеном пускает на страницу", () => {
    useAuthStore.getState().setToken("token");
    renderRoutes();
    expect(screen.getByText("profile")).toBeInTheDocument();
  });
});
