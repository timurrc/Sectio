import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./formatRelativeTime";

const NOW = 1_700_000_000_000;

describe("formatRelativeTime", () => {
  it("меньше минуты — «только что»", () => {
    expect(formatRelativeTime(NOW - 20_000, NOW)).toBe("только что");
  });

  it("минуты", () => {
    expect(formatRelativeTime(NOW - 5 * 60_000, NOW)).toBe("5 минут назад");
  });

  it("часы", () => {
    expect(formatRelativeTime(NOW - 3 * 3_600_000, NOW)).toBe("3 часа назад");
  });

  it("вчера", () => {
    expect(formatRelativeTime(NOW - 86_400_000, NOW)).toBe("вчера");
  });
});
