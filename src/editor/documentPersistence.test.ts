import { clear, set } from "idb-keyval";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDocumentStore } from "@/store/document.store";
import { createDocument, createSection } from "./documentFactory";
import { openDocument, startDocumentAutosave } from "./documentPersistence";
import { documentStorage } from "./documentStorage";

const savedTitle = async (id: string) => {
  const loaded = await documentStorage.load(id);
  return loaded.status === "ok" ? loaded.document.meta.title : null;
};

beforeEach(async () => {
  await clear();
  useDocumentStore.getState().setDocument(null);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("openDocument", () => {
  it("кладёт документ в стор", async () => {
    const document = { ...createDocument(), sections: [createSection("hero")] };
    await documentStorage.save(document);

    expect(await openDocument(document.id)).toEqual({ status: "ok", skippedTypes: [] });
    expect(useDocumentStore.getState().document?.sections).toHaveLength(1);
  });

  it("секции неизвестных блоков пропускаются и называются", async () => {
    const hero = createSection("hero");
    const document = {
      ...createDocument(),
      sections: [{ ...hero, id: "x", type: "removed" as never }, hero],
    };
    await documentStorage.save(document);

    expect(await openDocument(document.id)).toEqual({ status: "ok", skippedTypes: ["removed"] });
    expect(useDocumentStore.getState().document?.sections.map((s) => s.id)).toEqual([hero.id]);
  });

  it("нет документа → not-found, битый → corrupt, стор не трогается", async () => {
    await set("sectio:doc:broken", { id: "broken", sections: null });

    expect(await openDocument("missing")).toEqual({ status: "not-found" });
    expect(await openDocument("broken")).toEqual({ status: "corrupt" });
    expect(useDocumentStore.getState().document).toBeNull();
  });
});

describe("startDocumentAutosave", () => {
  const openAndEdit = async () => {
    const document = createDocument("До");
    await documentStorage.save(document);
    await openDocument(document.id);
    vi.useFakeTimers();
    const stop = startDocumentAutosave();
    useDocumentStore.getState().updateMeta({ title: "После" });
    return { id: document.id, stop };
  };

  it("сохраняет правку после паузы", async () => {
    const { id, stop } = await openAndEdit();
    expect(await savedTitle(id)).toBe("До");

    await vi.advanceTimersByTimeAsync(500);
    vi.useRealTimers();

    expect(await savedTitle(id)).toBe("После");
    stop();
  });

  it("перезагрузка или закрытие вкладки сохраняют правку сразу, не дожидаясь паузы", async () => {
    const { id, stop } = await openAndEdit();

    window.dispatchEvent(new Event("pagehide"));
    vi.useRealTimers();

    await vi.waitFor(async () => expect(await savedTitle(id)).toBe("После"));
    stop();
  });

  it("уход вкладки в фон сохраняет правку сразу", async () => {
    const { id, stop } = await openAndEdit();
    const visibility = vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");

    document.dispatchEvent(new Event("visibilitychange"));
    vi.useRealTimers();
    visibility.mockRestore();

    await vi.waitFor(async () => expect(await savedTitle(id)).toBe("После"));
    stop();
  });
});
