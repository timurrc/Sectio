import { expect, type FrameLocator, type Page, test as base } from "@playwright/test";

/** Ошибки консоли, которые ожидаемы: внешние запросы в e2e обрываются (Monaco с CDN) */
const ALLOWED_CONSOLE_ERRORS = [/Failed to load resource/, /cdn\.jsdelivr\.net/];

interface Fixtures {
  /** Ошибки консоли и необработанные исключения страницы за тест */
  consoleErrors: string[];
}

/**
 * Каждый тест — новый контекст браузера, значит пустой IndexedDB.
 * Тест падает, если в консоли появилась ошибка. Внешний интернет закрыт.
 */
export const test = base.extend<Fixtures>({
  consoleErrors: [
    async ({ page, context }, use) => {
      await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());

      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        const text = message.text();
        if (!ALLOWED_CONSOLE_ERRORS.some((pattern) => pattern.test(text))) errors.push(text);
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await use(errors);
      expect(errors, "ошибки в консоли").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const preview = (page: Page): FrameLocator =>
  page.frameLocator('iframe[title="Превью лендинга"]');

/** Названия секций в превью по порядку */
export const previewSections = (page: Page) =>
  preview(page)
    .locator("[data-section-id]")
    .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.label));

/** Создаёт проект из шаблона на главной и ждёт, пока превью нарисует секции */
export const createFromTemplate = async (page: Page, template: string) => {
  await page.goto("/");
  await page.getByRole("button", { name: `Создать проект по шаблону ${template}` }).click();
  await expect(page).toHaveURL(/\/editor\//);
  await expect(preview(page).locator("[data-section-id]").first()).toBeVisible();
};

/** Пустой проект: редактор без секций */
export const createEmptyProject = async (page: Page) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Пустой проект|Новый проект/ }).click();
  await expect(page).toHaveURL(/\/editor\//);
  await expect(preview(page).getByText(/Перетащите блок сюда/)).toBeVisible();
};
