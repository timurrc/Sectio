import { createEmptyProject, createFromTemplate, expect, previewSections, test } from "./fixtures";

test.describe("Проекты", () => {
  test("пустой список предлагает создать проект и шаблоны", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Соберите первый лендинг" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Создать проект по шаблону/ })).toHaveCount(3);
    await expect(page).toHaveTitle("Sectio");
  });

  test("проект из шаблона открывается в редакторе и остаётся в списке", async ({ page }) => {
    await createFromTemplate(page, "SaaS-продукт");

    await expect(page).toHaveTitle("SaaS-продукт · Sectio");
    expect(await previewSections(page)).toHaveLength(9);

    await page.getByRole("link", { name: "К списку проектов" }).click();
    await expect(page.getByRole("button", { name: "Открыть проект SaaS-продукт" })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: "Открыть проект SaaS-продукт" })).toBeVisible();
  });

  test("удаление спрашивает подтверждение, «Отмена» ничего не удаляет", async ({ page }) => {
    await createEmptyProject(page);
    await page.goto("/");
    const card = page.getByRole("listitem").filter({ hasText: "Новый лендинг" });

    await card.getByRole("button", { name: "Удалить проект Новый лендинг" }).click();
    await card.getByRole("button", { name: "Отмена" }).click();
    await expect(card).toBeVisible();

    await card.getByRole("button", { name: "Удалить проект Новый лендинг" }).click();
    await card.getByRole("button", { name: "Удалить", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Соберите первый лендинг" })).toBeVisible();
  });

  test("проект из другой вкладки не пропадает из списка", async ({ page, context }) => {
    await page.goto("/");
    const other = await context.newPage();
    await createFromTemplate(other, "Мобильное приложение");

    // Первая вкладка ничего не знала о новом проекте и создаёт свой
    await page
      .getByRole("button", { name: "Создать проект по шаблону Курс или мероприятие" })
      .click();
    await expect(page).toHaveURL(/\/editor\//);
    await page.goto("/");

    await expect(page.getByRole("button", { name: /^Открыть проект/ })).toHaveCount(2);
    await expect(
      page.getByRole("button", { name: "Открыть проект Мобильное приложение" }),
    ).toBeVisible();
  });

  test("открытый список обновляется, когда проект создают в другой вкладке", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Соберите первый лендинг" })).toBeVisible();

    const other = await context.newPage();
    await createFromTemplate(other, "SaaS-продукт");

    await expect(page.getByRole("button", { name: "Открыть проект SaaS-продукт" })).toBeVisible();
  });

  test("несуществующий проект и неизвестный адрес", async ({ page }) => {
    await page.goto("/editor/missing");
    await expect(page.getByRole("heading", { name: "Проект не найден" })).toBeVisible();
    await page.getByRole("link", { name: "К списку проектов" }).click();
    await expect(page).toHaveURL("/");

    await page.goto("/foo/bar");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  });

  test("повреждённый проект открывает экран ошибки, а не роняет приложение", async ({ page }) => {
    await page.goto("/");
    // Список уже прочитан — база idb-keyval создана
    await expect(page.getByRole("heading", { name: "Соберите первый лендинг" })).toBeVisible();
    await page.evaluate(
      () =>
        new Promise<void>((resolve, reject) => {
          const request = indexedDB.open("keyval-store");
          request.onsuccess = () => {
            const tx = request.result.transaction("keyval", "readwrite");
            tx.objectStore("keyval").put({ id: "broken", sections: null }, "sectio:doc:broken");
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
          };
          request.onerror = () => reject(request.error);
        }),
    );

    await page.reload();
    await expect(page.getByRole("button", { name: "Открыть проект Без названия" })).toBeVisible();
    await page.getByRole("button", { name: "Открыть проект Без названия" }).click();
    await expect(page.getByRole("heading", { name: "Проект не удалось открыть" })).toBeVisible();
  });
});
