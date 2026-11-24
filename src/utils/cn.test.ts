import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("убирает конфликтующие классы Tailwind", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("пропускает falsy-значения", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });
});
