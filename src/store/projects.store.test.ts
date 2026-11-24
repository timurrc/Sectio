import { clear, set } from "idb-keyval";
import { beforeEach, describe, expect, it } from "vitest";
import { createDocument } from "@/core/documentFactory";
import { documentStorage } from "@/core/documentStorage";
import { useProjectsStore } from "./projects.store";

const state = () => useProjectsStore.getState();

/** Вторая вкладка: свой экземпляр списка, то же IndexedDB */
const otherTab = async () => {
  const projects = await documentStorage.list();
  return {
    create: () => documentStorage.save(createDocument("Из другой вкладки")),
    projects,
  };
};

beforeEach(async () => {
  await clear();
  useProjectsStore.setState({ projects: [], loaded: false });
});

describe("projects.store", () => {
  it("createProject сохраняет документ и добавляет проект в начало списка", async () => {
    const first = await state().createProject();
    const second = await state().createProject();

    expect(state().projects.map((p) => p.id)).toEqual([second, first]);
    expect(await documentStorage.load(first)).toMatchObject({
      status: "ok",
      document: { id: first },
    });
  });

  it("renameProject меняет название и в списке, и в документе", async () => {
    const id = await state().createProject();
    await state().renameProject(id, "Кофейня");

    expect(state().projects[0].title).toBe("Кофейня");
    const loaded = await documentStorage.load(id);
    expect(loaded.status === "ok" && loaded.document.meta.title).toBe("Кофейня");
  });

  it("deleteProject удаляет проект и документ", async () => {
    const id = await state().createProject();
    await state().deleteProject(id);

    expect(state().projects).toHaveLength(0);
    expect(await documentStorage.load(id)).toEqual({ status: "not-found" });
  });

  it("load собирает список из документов, свежие сверху", async () => {
    await documentStorage.save({ ...createDocument("Старый"), updatedAt: 1 });
    await documentStorage.save({ ...createDocument("Новый"), updatedAt: 2 });

    await state().load();

    expect(state().loaded).toBe(true);
    expect(state().projects.map((p) => p.title)).toEqual(["Новый", "Старый"]);
  });

  it("проект из другой вкладки не пропадает, когда эта вкладка создаёт свой", async () => {
    await state().load();
    const tab = await otherTab();
    await tab.create();

    // Эта вкладка не знает о проекте другой и создаёт свой
    await state().createProject(createDocument("Из этой вкладки"));
    await state().load();

    expect(
      state()
        .projects.map((p) => p.title)
        .sort(),
    ).toEqual(["Из другой вкладки", "Из этой вкладки"]);
  });

  it("load удаляет старый общий список и показывает документы, которых в нём не было", async () => {
    const orphan = createDocument("Потерянный");
    await documentStorage.save(orphan);
    await set("sectio:projects", JSON.stringify({ state: { projects: [] }, version: 0 }));

    await state().load();

    expect(state().projects.map((p) => p.id)).toEqual([orphan.id]);
    expect(await documentStorage.list()).toHaveLength(1);
  });

  it("битый документ виден в списке под запасным названием", async () => {
    await set("sectio:doc:broken", { sections: null });

    await state().load();

    expect(state().projects).toEqual([{ id: "broken", title: "Без названия", updatedAt: 0 }]);
  });
});
