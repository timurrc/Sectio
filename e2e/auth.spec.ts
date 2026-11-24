import { expect, test } from "@playwright/test";

// Работает на моках: VITE_USE_MOCK=true в .env
test("гость попадает на логин, после входа возвращается в профиль", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByLabel("Пароль").fill("password");
  await page.getByRole("button", { name: "Войти" }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole("heading", { name: "Профиль" })).toBeVisible();
});
