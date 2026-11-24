import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDocumentTitle } from "./useDocumentTitle";

describe("useDocumentTitle", () => {
  it("ставит «Название · Sectio» и возвращает «Sectio» при уходе", () => {
    const { rerender, unmount } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: "Кофейня" as string | undefined },
    });
    expect(document.title).toBe("Кофейня · Sectio");

    rerender({ title: undefined });
    expect(document.title).toBe("Sectio");

    rerender({ title: "Курс" });
    unmount();
    expect(document.title).toBe("Sectio");
  });
});
