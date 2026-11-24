import { describe, expect, it } from "vitest";
import { isParentMessage, isPreviewMessage, wrap } from "./protocol";

describe("protocol", () => {
  it("wrap добавляет метку источника", () => {
    expect(wrap({ type: "ready" })).toEqual({ type: "ready", source: "sectio" });
  });

  it("принимает свои сообщения нужного направления", () => {
    expect(isPreviewMessage(wrap({ type: "ready" }))).toBe(true);
    expect(isParentMessage(wrap({ type: "hover:set", id: null }))).toBe(true);
    expect(isParentMessage(wrap({ type: "ready" }))).toBe(false);
    expect(isPreviewMessage(wrap({ type: "doc:set" }))).toBe(false);
    expect(isPreviewMessage(wrap({ type: "section:click", id: "a" }))).toBe(true);
    expect(isPreviewMessage(wrap({ type: "hotkey", event: { key: "z" } }))).toBe(true);
  });

  it("сообщения перетаскивания идут из превью, прокрутка — в превью", () => {
    expect(isPreviewMessage(wrap({ type: "section:drag", id: "a", y: 1 }))).toBe(true);
    expect(isPreviewMessage(wrap({ type: "section:drop", id: "a", y: 1 }))).toBe(true);
    expect(isPreviewMessage(wrap({ type: "section:drag-cancel" }))).toBe(true);
    expect(isParentMessage(wrap({ type: "scroll:by", dy: 10 }))).toBe(true);
    expect(isPreviewMessage(wrap({ type: "scroll:by", dy: 10 }))).toBe(false);
  });

  it("игнорирует чужие сообщения", () => {
    expect(isPreviewMessage(null)).toBe(false);
    expect(isPreviewMessage("ready")).toBe(false);
    expect(isPreviewMessage({ type: "ready" })).toBe(false);
    expect(isPreviewMessage({ type: "ready", source: "other" })).toBe(false);
  });
});
