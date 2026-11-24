import type { Page } from "@playwright/test";
import {
  createEmptyProject,
  createFromTemplate,
  expect,
  preview,
  previewSections,
  test,
} from "./fixtures";

const inspector = (page: Page) => page.getByRole("complementary", { name: "Свойства секции" });

/** Плавное движение мыши: и dnd-kit, и превью ждут несколько pointermove */
const dragMouse = async (
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number },
) => {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x, from.y + 10, { steps: 3 });
  await page.mouse.move(to.x, to.y, { steps: 12 });
};

test.describe("Редактор", () => {
  test("клик по секции в превью открывает её свойства, правка сразу видна", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    const heading = preview(page).getByRole("heading", { level: 1 });

    await heading.click();
    await expect(inspector(page)).toBeVisible();
    await expect(preview(page).locator("[data-selected]")).toHaveAttribute(
      "data-label",
      "Главный экран",
    );

    const title = inspector(page).getByRole("textbox", { name: "Заголовок", exact: true });
    await title.fill("Новый заголовок 🚀");
    await expect(heading).toHaveText("Новый заголовок 🚀");
  });

  test("разметка из полей не исполняется, опасная ссылка не попадает в модель", async ({
    page,
  }) => {
    await createFromTemplate(page, "SaaS-продукт");
    await preview(page).getByRole("heading", { level: 1 }).click();

    await inspector(page)
      .getByRole("textbox", { name: "Заголовок", exact: true })
      .fill('<img src=x onerror="window.__xss=1">');
    await expect(preview(page).getByRole("heading", { level: 1 })).toHaveText(
      '<img src=x onerror="window.__xss=1">',
    );
    expect(await preview(page).locator("img[src=x]").count()).toBe(0);

    const link = inspector(page).getByRole("textbox", { name: "Ссылка кнопки" });
    await link.fill("javascript:alert(1)");
    await expect(inspector(page).getByText(/Ссылка должна быть якорем/)).toBeVisible();
    await expect(
      preview(page).getByRole("link", { name: "Попробовать бесплатно" }),
    ).not.toHaveAttribute("href", /javascript/);
  });

  test("правка сохраняется, даже если сразу перезагрузить страницу", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    await preview(page).getByRole("heading", { level: 1 }).click();
    await inspector(page)
      .getByRole("textbox", { name: "Заголовок", exact: true })
      .fill("Сохранено");

    await page.reload();
    await expect(preview(page).getByRole("heading", { level: 1 })).toHaveText("Сохранено");
  });

  test("хоткеи: ⌘D, Delete, ⌘Z и ⇧⌘Z работают из превью", async ({ page }) => {
    await createFromTemplate(page, "Курс или мероприятие");
    const before = await previewSections(page);
    await preview(page).getByRole("heading", { level: 1 }).click();

    await page.keyboard.press("ControlOrMeta+d");
    await expect.poll(() => previewSections(page)).toHaveLength(before.length + 1);

    await page.keyboard.press("Delete");
    await expect.poll(() => previewSections(page)).toEqual(before);

    await page.keyboard.press("ControlOrMeta+z");
    await expect.poll(() => previewSections(page)).toHaveLength(before.length + 1);

    await page.keyboard.press("ControlOrMeta+Shift+z");
    await expect.poll(() => previewSections(page)).toEqual(before);
  });

  test("секцию можно перетащить прямо в превью, ⌘Z возвращает порядок", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    const before = await previewSections(page);
    expect(before.slice(0, 2)).toEqual(["Навигация", "Главный экран"]);

    const navbar = await preview(page).locator('[data-label="Навигация"]').boundingBox();
    const hero = await preview(page).locator('[data-label="Главный экран"]').boundingBox();
    if (!navbar || !hero) throw new Error("секции не видны");

    await dragMouse(
      page,
      { x: navbar.x + 40, y: navbar.y + navbar.height / 2 },
      { x: hero.x + 40, y: hero.y + hero.height * 0.8 },
    );
    await expect(page.getByTestId("canvas-drop-line")).toBeVisible();
    await expect(preview(page).locator("[data-drag-source]")).toHaveAttribute(
      "data-label",
      "Навигация",
    );
    await page.mouse.up();

    await expect
      .poll(async () => (await previewSections(page)).slice(0, 2))
      .toEqual(["Главный экран", "Навигация"]);
    await expect(inspector(page).getByRole("heading", { name: "Навигация" })).toBeVisible();

    await page.getByRole("button", { name: "Отменить" }).click();
    await expect.poll(() => previewSections(page)).toEqual(before);
  });

  test("Esc отменяет перетаскивание в превью", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    const before = await previewSections(page);
    const navbar = await preview(page).locator('[data-label="Навигация"]').boundingBox();
    if (!navbar) throw new Error("секция не видна");

    await dragMouse(
      page,
      { x: navbar.x + 40, y: navbar.y + navbar.height / 2 },
      { x: navbar.x + 40, y: navbar.y + 400 },
    );
    await expect(page.getByTestId("canvas-drop-line")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("canvas-drop-line")).toBeHidden();
    await page.mouse.up();

    expect(await previewSections(page)).toEqual(before);
  });

  test("у нижнего края холста превью прокручивается само", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    const frame = await page.locator('iframe[title="Превью лендинга"]').boundingBox();
    const navbar = await preview(page).locator('[data-label="Навигация"]').boundingBox();
    if (!frame || !navbar) throw new Error("превью не видно");

    await dragMouse(
      page,
      { x: navbar.x + 40, y: navbar.y + navbar.height / 2 },
      { x: frame.x + 100, y: frame.y + frame.height - 10 },
    );
    const scrollY = () =>
      preview(page)
        .locator("html")
        .evaluate(() => window.scrollY);
    await expect.poll(scrollY).toBeGreaterThan(200);
    await page.mouse.up();

    // Навигация ушла вниз страницы
    await expect.poll(async () => (await previewSections(page))[0]).toBe("Главный экран");
  });

  test("блок из библиотеки перетаскивается на холст с линией вставки", async ({ page }) => {
    await createEmptyProject(page);
    await page.getByRole("button", { name: "Добавить блок Главный экран" }).click();
    await expect.poll(() => previewSections(page)).toEqual(["Главный экран"]);

    const card = await page.getByRole("button", { name: "Добавить блок Навигация" }).boundingBox();
    const frame = await page.locator('iframe[title="Превью лендинга"]').boundingBox();
    if (!card || !frame) throw new Error("библиотека или холст не видны");

    await dragMouse(
      page,
      { x: card.x + card.width / 2, y: card.y + card.height / 2 },
      { x: frame.x + frame.width / 2, y: frame.y + 20 },
    );
    await expect(page.getByTestId("canvas-drop-line")).toBeVisible();
    await page.mouse.up();

    await expect.poll(() => previewSections(page)).toEqual(["Навигация", "Главный экран"]);
  });

  test("структура: сортировка с клавиатуры", async ({ page }) => {
    await createFromTemplate(page, "Курс или мероприятие");
    const before = await previewSections(page);
    await page.getByRole("tab", { name: /Структура/ }).click();

    const handle = page.getByRole("button", { name: `Перетащить: ${before[0]}` });
    await handle.focus();
    await page.keyboard.press("Space");
    await expect(handle).toHaveAttribute("aria-pressed", "true");
    // dnd-kit слушает стрелки не сразу после пробела (setTimeout): повторяем, пока озвучка
    // не скажет, что секция над следующей
    const status = page.getByRole("status");
    await expect(async () => {
      await page.keyboard.press("ArrowDown");
      await expect(status).toContainText(`над: секция «${before[1]}»`, { timeout: 300 });
    }).toPass();
    await page.keyboard.press("Space");

    await expect
      .poll(async () => (await previewSections(page)).slice(0, 2))
      .toEqual([before[1], before[0]]);
  });

  test("тема страницы меняет цвета превью", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    await page.getByRole("textbox", { name: "Акцент", exact: true }).fill("#16A34A");

    await expect
      .poll(() =>
        preview(page)
          .locator("html")
          .evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue("--color-primary"),
          ),
      )
      .toMatch(/#16a34a/i);
  });

  test("длинные пункты списка не распирают панель свойств", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    await preview(page).locator('[data-label="Отзывы"]').getByRole("heading").first().click();
    await expect(inspector(page).getByText(/^Отзыв 1/)).toBeVisible();

    const overflow = await inspector(page).evaluate(
      (aside) => aside.scrollWidth - aside.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});
