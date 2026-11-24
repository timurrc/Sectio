import { describe, expect, it } from "vitest";
import { isSafeHref, linkSchema } from "./link";

describe("isSafeHref", () => {
  it.each([
    "",
    "#",
    "#pricing",
    "/about",
    "about.html",
    "https://a.ru",
    "HTTP://a.ru",
    "mailto:a@b.ru",
    "tel:+7900",
  ])("пропускает %j", (href) => expect(isSafeHref(href)).toBe(true));

  it.each([
    "javascript:alert(1)",
    " JavaScript:alert(1)",
    "data:text/html,<b>",
    "vbscript:x",
    "file:///etc",
  ])("отклоняет %j", (href) => expect(isSafeHref(href)).toBe(false));
});

describe("linkSchema", () => {
  it("отдаёт понятную ошибку для опасной ссылки", () => {
    const result = linkSchema().safeParse("javascript:alert(1)");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/якорем/);
  });
});
