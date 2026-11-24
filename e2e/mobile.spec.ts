import { expect, test } from "./fixtures";

test.describe("Телефон 390×844", () => {
  test("список проектов без горизонтальной прокрутки", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Соберите первый лендинг" })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });

  test("редактор объясняет, что нужен экран шире, и ведёт к списку", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Создать проект по шаблону SaaS-продукт" }).click();

    await expect(page.getByRole("heading", { name: "Редактору нужен экран пошире" })).toBeVisible();
    await expect(page.getByTitle("Превью лендинга")).toHaveCount(0);
    await page.getByRole("link", { name: "К списку проектов" }).click();
    await expect(page.getByRole("button", { name: "Открыть проект SaaS-продукт" })).toBeVisible();
  });
});
