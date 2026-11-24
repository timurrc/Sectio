import { mkdir, writeFile } from "node:fs/promises";
// Обычный test, а не из fixtures: демо нужен Monaco с CDN, а фикстура закрывает интернет
import { type Page, test } from "@playwright/test";
import gifenc from "gifenc";
import { PNG } from "pngjs";
import { createFromTemplate, expect, preview, previewSections } from "./fixtures";

/**
 * Запись docs/demo.gif и docs/screenshot.png для README: bun run demo.
 * Не тест, а сценарий: кадры снимаются скриншотами и склеиваются в GIF без ffmpeg.
 */

interface IFrame {
  png: Buffer;
  /** Сколько показывать кадр, мс */
  delay: number;
}

const frames: IFrame[] = [];

/** Ждёт конца CSS-переходов и в редакторе, и в превью: иначе кадр ловит цвет на полпути */
const settle = async (page: Page) => {
  const waitAnimations = () =>
    Promise.all(document.getAnimations().map((animation) => animation.finished));
  await page.evaluate(waitAnimations);
  await preview(page).locator("html").evaluate(waitAnimations);
};

const snap = async (page: Page, delay = 120) => {
  frames.push({ png: await page.screenshot(), delay });
};

/** Печать по буквам с кадром на каждые несколько символов */
const typeSlowly = async (page: Page, text: string) => {
  for (let index = 0; index < text.length; index += 3) {
    await page.keyboard.type(text.slice(index, index + 3));
    await snap(page, 80);
  }
};

// gifenc — CommonJS-пакет: именованные экспорты достаём из default
const { applyPalette, GIFEncoder, quantize } = gifenc;

const encodeGif = (list: IFrame[]) => {
  const gif = GIFEncoder();
  for (const { png, delay } of list) {
    const { width, height, data } = PNG.sync.read(png);
    const palette = quantize(data, 256);
    gif.writeFrame(applyPalette(data, palette), width, height, { palette, delay });
  }
  gif.finish();
  return gif.bytes();
};

test("демо для README", async ({ page }) => {
  test.setTimeout(120_000);
  // Кнопка TanStack devtools есть только в dev-сборке: в демо она лишняя
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.textContent =
        '[aria-label="Open Tanstack query devtools"] { display: none !important; }';
      document.head.append(style);
    });
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Соберите первый лендинг" })).toBeVisible();
  await snap(page, 1200);

  // Проект из шаблона
  await createFromTemplate(page, "SaaS-продукт");
  await snap(page, 1200);

  // Клик по секции в превью → инспектор → правка текста видна сразу
  await preview(page).getByRole("heading", { level: 1 }).click();
  await snap(page, 600);
  const title = page
    .getByRole("complementary", { name: "Свойства секции" })
    .getByRole("textbox", { name: "Заголовок", exact: true });
  await title.selectText();
  await typeSlowly(page, "Лендинг за один вечер");
  await snap(page, 1000);

  // Тёмный вариант секции
  await page.getByRole("radio", { name: "Тёмная" }).click();
  await settle(page);
  await snap(page, 1000);
  await mkdir("docs", { recursive: true });
  await page.screenshot({ path: "docs/screenshot.png" });

  // Перетаскивание секции прямо в превью
  const navbar = await preview(page).locator('[data-label="Навигация"]').boundingBox();
  const hero = await preview(page).locator('[data-label="Главный экран"]').boundingBox();
  if (!navbar || !hero) throw new Error("секции не видны");
  await page.mouse.move(navbar.x + 60, navbar.y + navbar.height / 2);
  await page.mouse.down();
  for (let step = 1; step <= 6; step++) {
    await page.mouse.move(
      navbar.x + 60,
      navbar.y + ((hero.y + hero.height * 0.85 - navbar.y) * step) / 6,
    );
    await snap(page, 90);
  }
  await snap(page, 500);
  await page.mouse.up();
  await expect.poll(async () => (await previewSections(page))[0]).toBe("Главный экран");
  await snap(page, 900);

  // Палитра ⌘K: поиск блока и вставка
  await page.keyboard.press("ControlOrMeta+k");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("combobox").focus();
  await typeSlowly(page, "отзывы");
  await snap(page, 900);
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  await snap(page, 1000);

  // Вкладка «Код»: сгенерированный проект
  await page.getByRole("radio", { name: "Код" }).click();
  await expect(page.getByRole("navigation").getByText("package.json")).toBeVisible();
  await expect(page.locator(".monaco-editor").first()).toBeVisible({ timeout: 15_000 });
  await snap(page, 2000);

  await writeFile("docs/demo.gif", encodeGif(frames));
});
