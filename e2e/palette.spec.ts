import { createFromTemplate, expect, preview, previewSections, test } from "./fixtures";

test.describe("Палитра ⌘K", () => {
  test("открывается из превью, ищет блок и вставляет его после выбранной секции", async ({
    page,
  }) => {
    await createFromTemplate(page, "Курс или мероприятие");
    const before = await previewSections(page);
    await preview(page).getByRole("heading", { level: 1 }).click();

    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByRole("combobox").fill("вопросы");
    await page.keyboard.press("Enter");

    await expect(dialog).toBeHidden();
    await expect.poll(() => previewSections(page)).toHaveLength(before.length + 1);
    // Фокус не потерялся: снова ⌘K открывает палитру
    await page.keyboard.press("ControlOrMeta+k");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("открывается из поля ввода", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    await page.getByRole("textbox", { name: "Название" }).focus();
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("шаблон заменяет все секции, один ⌘Z возвращает прежние", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    const before = await previewSections(page);

    await page.getByRole("button", { name: /Блоки, действия и шаблоны/ }).click();
    await page.getByRole("dialog").getByRole("combobox").fill("Шаблон мобильное");
    await page.keyboard.press("Enter");
    await expect.poll(() => previewSections(page)).not.toEqual(before);

    await page.keyboard.press("ControlOrMeta+z");
    await expect.poll(() => previewSections(page)).toEqual(before);
  });

  test("пустой результат объясняет, что искать", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    await page.keyboard.press("ControlOrMeta+k");
    // Палитра грузится лениво: ждём диалог, а не любой combobox на странице
    await page.getByRole("dialog").getByRole("combobox").fill("zzqxw");
    await expect(page.getByText(/Ничего не нашлось/)).toBeVisible();
  });
});
