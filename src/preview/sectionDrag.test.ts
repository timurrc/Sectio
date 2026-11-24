import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PreviewToParent } from "@/core/protocol";
import { DRAG_THRESHOLD, startSectionDrag } from "./sectionDrag";

const send = vi.fn<(message: PreviewToParent) => void>();
let stop: () => void;

const pointer = (type: string, target: Element, y: number, init: PointerEventInit = {}) =>
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      button: 0,
      pointerId: 1,
      clientX: 10,
      clientY: y,
      ...init,
    }),
  );

const section = () => document.querySelector<HTMLElement>('[data-section-id="a"]')!;
const types = () => send.mock.calls.map(([message]) => message.type);

beforeEach(() => {
  document.body.innerHTML = `
    <div data-section-id="a"><h1>Заголовок</h1><input aria-label="Поле" /></div>
    <div data-section-id="b"><p>Текст</p></div>`;
  send.mockClear();
  stop = startSectionDrag(send);
});

afterEach(() => {
  stop();
  document.body.innerHTML = "";
});

describe("startSectionDrag", () => {
  it("короткое движение — это клик, а не перетаскивание", () => {
    const title = section().querySelector("h1")!;
    pointer("pointerdown", title, 100);
    pointer("pointermove", title, 100 + DRAG_THRESHOLD - 1);
    pointer("pointerup", title, 100 + DRAG_THRESHOLD - 1);

    expect(send).not.toHaveBeenCalled();
  });

  it("зажал и повёл — шлёт drag с y курсора, отпустил — drop", () => {
    const title = section().querySelector("h1")!;
    pointer("pointerdown", title, 100);
    pointer("pointermove", title, 140);

    expect(send).toHaveBeenLastCalledWith({ type: "section:drag", id: "a", y: 140 });
    expect(section()).toHaveAttribute("data-drag-source");
    expect(document.documentElement).toHaveAttribute("data-dragging");

    pointer("pointerup", title, 180);

    expect(send).toHaveBeenLastCalledWith({ type: "section:drop", id: "a", y: 180 });
    expect(section()).not.toHaveAttribute("data-drag-source");
    expect(document.documentElement).not.toHaveAttribute("data-dragging");
  });

  it("клик сразу после перетаскивания не доходит до превью", () => {
    const onClick = vi.fn();
    document.addEventListener("click", onClick);
    const title = section().querySelector("h1")!;
    pointer("pointerdown", title, 100);
    pointer("pointermove", title, 160);
    pointer("pointerup", title, 160);
    title.click();
    title.click();

    expect(onClick).toHaveBeenCalledTimes(1);
    document.removeEventListener("click", onClick);
  });

  it("Esc отменяет перетаскивание и не уходит дальше как хоткей", () => {
    const onKeyDown = vi.fn();
    window.addEventListener("keydown", onKeyDown);
    const title = section().querySelector("h1")!;
    pointer("pointerdown", title, 100);
    pointer("pointermove", title, 160);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    pointer("pointerup", title, 160);

    expect(types()).toEqual(["section:drag", "section:drag-cancel"]);
    expect(onKeyDown).not.toHaveBeenCalled();
    window.removeEventListener("keydown", onKeyDown);
  });

  it("из поля ввода и правой кнопкой не тащится", () => {
    const input = section().querySelector("input")!;
    pointer("pointerdown", input, 100);
    pointer("pointermove", input, 160);
    pointer("pointerdown", section(), 100, { button: 2 });
    pointer("pointermove", section(), 160);

    expect(send).not.toHaveBeenCalled();
  });
});
