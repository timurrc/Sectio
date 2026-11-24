import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Tabs from "./Tabs";

const ITEMS = [
  { id: "blocks", label: "Блоки" },
  { id: "outline", label: "Структура" },
] as const;

describe("Tabs", () => {
  it("отмечает активную вкладку", () => {
    render(<Tabs label="Панель" value="blocks" items={[...ITEMS]} onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Блоки" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Структура" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("вызывает onChange с id вкладки", async () => {
    const onChange = vi.fn();
    render(<Tabs label="Панель" value="blocks" items={[...ITEMS]} onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Структура" }));
    expect(onChange).toHaveBeenCalledWith("outline");
  });
});
