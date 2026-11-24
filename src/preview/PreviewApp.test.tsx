import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDocument, createSection } from "@/core/documentFactory";
import { wrap, type ParentToPreview } from "@/core/protocol";
import type { IDocument } from "@/types/document.types";
import PreviewApp from "./PreviewApp";

/** В jsdom window.parent === window, поэтому «родитель» шлёт сообщение самому окну */
const sendMessage = (message: ParentToPreview) =>
  act(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        data: wrap(message),
        source: window,
        origin: window.location.origin,
      }),
    );
  });

const sendDoc = (document: IDocument) => sendMessage({ type: "doc:set", document });

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
    expect(screen.getByText(/Перетащите блок сюда/)).toBeInTheDocument();

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
    expect(screen.queryByText(/Перетащите блок сюда/)).not.toBeInTheDocument();
  });

  it("клик по секции шлёт section:click, selection:set ставит рамку", () => {
    const spy = vi.spyOn(window.parent, "postMessage");
    const { container } = render(<PreviewApp />);
    const hero = createSection("hero");
    sendDoc({ ...createDocument(), sections: [hero] });

    fireEvent.click(screen.getByRole("heading", { level: 1 }));
    expect(spy).toHaveBeenCalledWith(
      wrap({ type: "section:click", id: hero.id }),
      window.location.origin,
    );

    const wrapper = container.querySelector(`[data-section-id="${hero.id}"]`);
    expect(wrapper).not.toHaveAttribute("data-selected");
    sendMessage({ type: "selection:set", id: hero.id });
    expect(wrapper).toHaveAttribute("data-selected");
    expect(wrapper).toHaveAttribute("data-label", "Главный экран");
  });

  it("пересылает родителю только хоткеи редактора", () => {
    const spy = vi.spyOn(window.parent, "postMessage");
    render(<PreviewApp />);
    sendDoc(createDocument());

    fireEvent.keyDown(window, { key: "a" });
    fireEvent.keyDown(window, { key: "z", metaKey: true });

    const hotkeys = spy.mock.calls.filter(([data]) => (data as { type: string }).type === "hotkey");
    expect(hotkeys).toHaveLength(1);
    expect(hotkeys[0][0]).toMatchObject({ event: { key: "z", metaKey: true } });
  });
});
