import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { createFromTemplate, expect, preview, test } from "./fixtures";

/** WCAG 2.2 AA для интерфейса редактора. Лендинг в iframe — данные пользователя, его не судим */
const audit = (page: Page) =>
  new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude('iframe[title="Превью лендинга"]')
    .analyze();

const seriousViolations = async (page: Page) =>
  (await audit(page)).violations
    .filter(({ impact }) => impact === "serious" || impact === "critical")
    .map(({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(" ")).join(", ")}`);

test.describe("Доступность", () => {
  for (const scheme of ["light", "dark"] as const) {
    test(`главная без серьёзных нарушений (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Соберите первый лендинг" })).toBeVisible();
      expect(await seriousViolations(page)).toEqual([]);
    });

    test(`редактор без серьёзных нарушений (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await createFromTemplate(page, "SaaS-продукт");
      expect(await seriousViolations(page)).toEqual([]);

      await preview(page).getByRole("heading", { level: 1 }).click();
      await expect(page.getByRole("complementary", { name: "Свойства секции" })).toBeVisible();
      expect(await seriousViolations(page)).toEqual([]);
    });
  }

  test("главный сценарий проходится с клавиатуры", async ({ page }) => {
    await page.goto("/");
    // Tab до шаблона и Enter — проект создан
    const template = page.getByRole("button", { name: "Создать проект по шаблону SaaS-продукт" });
    for (
      let step = 0;
      step < 10 && !(await template.evaluate((el) => el === document.activeElement));
      step++
    ) {
      await page.keyboard.press("Tab");
    }
    await expect(template).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/editor\//);

    // Структура → выбрать секцию → свойства
    await page.getByRole("tab", { name: /Структура/ }).focus();
    await page.keyboard.press("Enter");
    await page
      .getByRole("list", { name: "Секции страницы" })
      .getByRole("button", { name: /^Главный экран/ })
      .focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("complementary", { name: "Свойства секции" })).toBeVisible();
  });
});
