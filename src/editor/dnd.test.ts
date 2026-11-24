import { describe, expect, it } from "vitest";
import { getDropIndex } from "./dnd";

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
