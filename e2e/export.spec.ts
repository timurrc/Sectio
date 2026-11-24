import { readFile } from "node:fs/promises";
import JSZip from "jszip";
import { createFromTemplate, expect, preview, test } from "./fixtures";

test.describe("Код и экспорт", () => {
  test("вкладка «Код» показывает дерево проекта и открывает файл выбранной секции", async ({
    page,
  }) => {
    await createFromTemplate(page, "SaaS-продукт");
    await preview(page).getByRole("heading", { level: 1 }).click();

    await page.getByRole("radio", { name: "Код" }).click();
    const tree = page.getByRole("navigation");
    await expect(tree.getByText("package.json")).toBeVisible();
    await expect(tree.getByText("Hero.tsx")).toBeVisible();
    await expect(page.getByText("src/sections/Hero.tsx")).toBeVisible();

    await page.getByRole("radio", { name: "Превью" }).click();
    await expect(preview(page).getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("zip содержит Vite-проект с файлами всех секций и данными из модели", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");
    await preview(page).getByRole("heading", { level: 1 }).click();
    await page
      .getByRole("complementary", { name: "Свойства секции" })
      .getByRole("textbox", { name: "Заголовок", exact: true })
      .fill('Кавычки " и \\ обратный слэш');

    const downloading = page.waitForEvent("download");
    await page.getByRole("button", { name: "Экспорт" }).click();
    const download = await downloading;
    expect(download.suggestedFilename()).toMatch(/\.zip$/);
    await expect(page.getByText("Архив проекта скачан")).toBeVisible();

    const zip = await JSZip.loadAsync(await readFile((await download.path()) ?? ""));
    const files = Object.keys(zip.files);
    expect(files).toEqual(
      expect.arrayContaining([
        "package.json",
        "index.html",
        "vite.config.ts",
        "src/App.tsx",
        "src/main.tsx",
        "src/index.css",
        "src/sections/Hero.tsx",
        "src/sections/Navbar.tsx",
        "src/sections/Footer.tsx",
      ]),
    );

    const hero = await zip.file("src/sections/Hero.tsx")?.async("string");
    // Строка в коде экранирована: кавычка внутри одинарных кавычек как есть, слэш удвоен
    expect(hero).toContain(`'Кавычки " и \\\\ обратный слэш'`);
    const pkg = JSON.parse((await zip.file("package.json")?.async("string")) ?? "{}");
    expect(pkg.scripts.build).toBeTruthy();
  });
});
