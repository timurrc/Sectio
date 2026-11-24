import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SegmentedControl from "./SegmentedControl";

describe("SegmentedControl", () => {
  it("отмечает текущий вариант и сообщает о выборе", async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Тема"
        value="light"
        items={[
          { id: "light", label: "Светлая" },
          { id: "dark", label: "Тёмная" },
        ]}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole("radio", { name: "Светлая" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("radio", { name: "Тёмная" }));
    expect(onChange).toHaveBeenCalledWith("dark");
  });
});
