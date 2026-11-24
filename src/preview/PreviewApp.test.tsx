import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDocument, createSection } from "@/editor/documentFactory";
import { wrap } from "@/editor/protocol";
import type { IDocument } from "@/types/document.types";
import PreviewApp from "./PreviewApp";

/** В jsdom window.parent === window, поэтому «родитель» шлёт сообщение самому окну */
const sendDoc = (document: IDocument) =>
  act(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        data: wrap({ type: "doc:set", document }),
        source: window,
        origin: window.location.origin,
      }),
    );
  });

afterEach(() => vi.restoreAllMocks());

describe("PreviewApp", () => {
  it("сообщает родителю, что готов", () => {
    const spy = vi.spyOn(window.parent, "postMessage");
    render(<PreviewApp />);
    expect(spy).toHaveBeenCalledWith(wrap({ type: "ready" }), window.location.origin);
  });

  it("показывает пустое состояние и секции из doc:set", () => {
    render(<PreviewApp />);
    const document = createDocument();
    sendDoc(document);
    expect(screen.getByText(/Добавьте первую секцию/)).toBeInTheDocument();

    const hero = createSection("hero");
    sendDoc({ ...document, sections: [hero] });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      (hero.props as { title: string }).title,
    );
  });

  it("тёмная секция получает класс dark на обёртке", () => {
    const { container } = render(<PreviewApp />);
    const section = createSection("cta", { theme: "dark" });
    sendDoc({ ...createDocument(), sections: [section] });
    expect(container.querySelector(`[data-section-id="${section.id}"]`)).toHaveClass("dark");
  });

  it("при невалидных props рисует defaults и шлёт section:invalid", () => {
    const spy = vi.spyOn(window.parent, "postMessage");
    render(<PreviewApp />);
    const broken = { ...createSection("hero"), props: { title: 123 } };
    sendDoc({ ...createDocument(), sections: [broken] });

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(spy).toHaveBeenCalledWith(
      wrap({ type: "section:invalid", id: broken.id, blockName: "Главный экран" }),
      window.location.origin,
    );
  });

  it("игнорирует сообщения с чужим origin", () => {
    render(<PreviewApp />);
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: wrap({ type: "doc:set", document: createDocument() }),
          source: window,
          origin: "https://evil.example",
        }),
      );
    });
    expect(screen.queryByText(/Добавьте первую секцию/)).not.toBeInTheDocument();
  });
});
