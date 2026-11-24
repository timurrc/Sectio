import { describe, expect, it } from "vitest";
import { AUTO_SCROLL_MAX, getAutoScrollDelta, getDropIndex, getSectionMove } from "./dnd";

const rects = [
  { id: "a", top: 0, left: 0, width: 100, height: 200 },
  { id: "b", top: 200, left: 0, width: 100, height: 100 },
];

describe("getDropIndex", () => {
  it("вставка до секции, если курсор выше её середины", () => {
    expect(getDropIndex(rects, 50)).toEqual({ index: 0, lineY: 0 });
    expect(getDropIndex(rects, 120)).toEqual({ index: 1, lineY: 200 });
  });

  it("в конец, если курсор ниже середины последней", () => {
    expect(getDropIndex(rects, 260)).toEqual({ index: 2, lineY: 300 });
  });

  it("пустой документ — индекс 0", () => {
    expect(getDropIndex([], 40)).toEqual({ index: 0, lineY: 0 });
  });
});

describe("getSectionMove", () => {
  const three = [
    { id: "a", top: 0, left: 0, width: 100, height: 100 },
    { id: "b", top: 100, left: 0, width: 100, height: 100 },
    { id: "c", top: 200, left: 0, width: 100, height: 100 },
  ];

  it("вниз: итоговая позиция на одну меньше индекса вставки", () => {
    expect(getSectionMove(three, "a", 260)).toEqual({ toIndex: 2, lineY: 300 });
    expect(getSectionMove(three, "a", 160)).toEqual({ toIndex: 1, lineY: 200 });
  });

  it("вверх: позиция равна индексу вставки", () => {
    expect(getSectionMove(three, "c", 20)).toEqual({ toIndex: 0, lineY: 0 });
  });

  it("на своё же место или неизвестная секция — null", () => {
    expect(getSectionMove(three, "b", 120)).toBeNull();
    expect(getSectionMove(three, "b", 180)).toBeNull();
    expect(getSectionMove(three, "x", 20)).toBeNull();
  });
});

describe("getAutoScrollDelta", () => {
  it("в середине холста не прокручивает", () => {
    expect(getAutoScrollDelta(300, 600)).toBe(0);
  });

  it("у верхнего края — вверх, у нижнего — вниз, у самого края быстрее", () => {
    expect(getAutoScrollDelta(40, 600)).toBeLessThan(0);
    expect(getAutoScrollDelta(570, 600)).toBeGreaterThan(0);
    expect(Math.abs(getAutoScrollDelta(5, 600))).toBeGreaterThan(
      Math.abs(getAutoScrollDelta(40, 600)),
    );
  });

  it("за краем — максимальная скорость", () => {
    expect(getAutoScrollDelta(-30, 600)).toBe(-AUTO_SCROLL_MAX);
    expect(getAutoScrollDelta(650, 600)).toBe(AUTO_SCROLL_MAX);
  });
});
