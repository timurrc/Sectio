import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { createDocument } from "@/core/documentFactory";
import { useDocumentStore } from "@/store/document.store";
import ThemeEditor from "./ThemeEditor";
import { getContrastWarnings } from "./useThemeEditor";

const doc = () => useDocumentStore.getState().document!;

beforeEach(() => useDocumentStore.getState().setDocument(createDocument("Кофейня")));

describe("ThemeEditor", () => {
  it("меняет название страницы", async () => {
    render(<ThemeEditor />);
    const title = screen.getByLabelText("Название");
    await userEvent.clear(title);
    await userEvent.type(title, "Чайная");
    expect(doc().meta.title).toBe("Чайная");
  });

  it("hex акцента пишет primary и подбирает primaryHover в выбранной теме", async () => {
    render(<ThemeEditor />);
    await userEvent.click(screen.getByRole("radio", { name: "Тёмная" }));
    const field = screen.getByLabelText("Акцент");
    await userEvent.clear(field);
    await userEvent.type(field, "#22aa55");

    expect(doc().theme.dark.primary).toBe("#22aa55");
    expect(doc().theme.dark.primaryHover).not.toBe("#22aa55");
    expect(doc().theme.light.primary).not.toBe("#22aa55");
  });

  it("неполный hex не попадает в модель", async () => {
    render(<ThemeEditor />);
    const before = doc().theme.light.text;
    const field = screen.getByLabelText("Текст");
    await userEvent.clear(field);
    await userEvent.type(field, "#12");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(doc().theme.light.text).toBe(before);
  });

  it("предупреждает о низком контрасте", () => {
    const tokens = { ...doc().theme.light, text: "#eeeeee", bg: "#ffffff" };
    expect(getContrastWarnings(tokens).map((item) => item.label)).toContain("Текст на фоне");
    expect(getContrastWarnings(doc().theme.light)).toEqual([]);
  });
});
