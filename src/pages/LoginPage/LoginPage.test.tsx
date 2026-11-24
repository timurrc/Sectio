import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { MOCK_TOKEN } from "@/constants/mock";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { renderWithProviders } from "@/test/renderWithProviders";
import LoginPage from "./LoginPage";

const renderLogin = () =>
  renderWithProviders(
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.HOME} element={<p>home</p>} />
    </Routes>,
    { route: ROUTES.LOGIN },
  );

describe("LoginPage", () => {
  beforeEach(() => useAuthStore.getState().logout());

  it("показывает ошибки zod и не отправляет форму", async () => {
    renderLogin();
    await userEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByText("Введите корректный email")).toBeInTheDocument();
    expect(screen.getByText("Минимум 6 символов")).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("логинит через API (MSW) и уводит на главную", async () => {
    renderLogin();
    await userEvent.type(screen.getByLabelText("Email"), "demo@example.com");
    await userEvent.type(screen.getByLabelText("Пароль"), "password");
    await userEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByText("home")).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBe(MOCK_TOKEN);
  });

  it("показывает ошибку поля с бэкенда", async () => {
    renderLogin();
    await userEvent.type(screen.getByLabelText("Email"), "demo@example.com");
    await userEvent.type(screen.getByLabelText("Пароль"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByText("Неверный пароль")).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
