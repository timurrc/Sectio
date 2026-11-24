import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Switch from "./Switch";

describe("Switch", () => {
  it("доступен по подписи и переключает значение", async () => {
    const onChange = vi.fn();
    render(<Switch label="Выделить" checked={false} onChange={onChange} />);
    const toggle = screen.getByRole("switch", { name: "Выделить" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
