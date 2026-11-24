import { beforeEach, describe, expect, it } from "vitest";
import { documentStorage } from "@/editor/documentStorage";
import { useProjectsStore } from "./projects.store";

const state = () => useProjectsStore.getState();

beforeEach(() => {
  useProjectsStore.setState({ projects: [] });
});

describe("projects.store", () => {
  it("createProject сохраняет документ и добавляет проект в начало списка", async () => {
    const first = await state().createProject();
    const second = await state().createProject();

    expect(state().projects.map((p) => p.id)).toEqual([second, first]);
    expect(await documentStorage.load(first)).toMatchObject({ id: first });
  });

  it("renameProject меняет название и в списке, и в документе", async () => {
    const id = await state().createProject();
    await state().renameProject(id, "Кофейня");

    expect(state().projects[0].title).toBe("Кофейня");
    expect((await documentStorage.load(id))?.meta.title).toBe("Кофейня");
  });

  it("deleteProject удаляет проект и документ", async () => {
    const id = await state().createProject();
    await state().deleteProject(id);

    expect(state().projects).toHaveLength(0);
    expect(await documentStorage.load(id)).toBeUndefined();
  });
});
