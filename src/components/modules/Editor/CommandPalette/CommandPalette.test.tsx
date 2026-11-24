import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { createDocument, createSection } from "@/editor/documentFactory";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import CommandPalette from "./CommandPalette";

const types = () => useDocumentStore.getState().document?.sections.map((s) => s.type);

beforeEach(() => {
  useDocumentStore
    .getState()
    .setDocument({ ...createDocument(), sections: [{ ...createSection("hero"), id: "s0" }] });
  useEditorStore.getState().reset();
  useEditorStore.getState().setPaletteOpen(true);
});

describe("CommandPalette", () => {
  it("фокус в поиске, пункты сгруппированы", () => {
    render(<CommandPalette />);
    expect(screen.getByRole("combobox")).toHaveFocus();
    expect(screen.getByText("Блоки")).toBeInTheDocument();
    expect(screen.getByText("Шаблоны")).toBeInTheDocument();
  });

  it("поиск + Enter добавляет блок и закрывает палитру", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    await user.type(screen.getByRole("combobox"), "вопросы");
    expect(screen.getAllByRole("option")[0]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Enter}");
    expect(types()).toEqual(["hero", "faq"]);
    expect(useEditorStore.getState().paletteOpen).toBe(false);
  });

  it("стрелки двигают активный пункт, клик выполняет пункт", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    await user.type(screen.getByRole("combobox"), "отзывы");
    await user.keyboard("{ArrowDown}");
    const options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    await user.click(options[1]);
    const added = useDocumentStore.getState().document?.sections[1];
    expect(added?.type).toBe("testimonials");
    expect(added?.variant).toBe("large");
  });

  it("Esc закрывает без изменений", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    await user.keyboard("{Escape}");
    expect(useEditorStore.getState().paletteOpen).toBe(false);
    expect(types()).toEqual(["hero"]);
  });

  it("пустой результат объясняет, что искать", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    await user.type(screen.getByRole("combobox"), "zzqxw");
    expect(screen.getByText(/Ничего не нашлось/)).toBeInTheDocument();
  });
});
