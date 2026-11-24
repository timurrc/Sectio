import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TEMPLATES } from "@/constants/templates";
import TemplateGallery from "./TemplateGallery";

describe("TemplateGallery", () => {
  it("показывает все шаблоны и отдаёт выбранный", async () => {
    const onSelect = vi.fn();
    render(<TemplateGallery templates={TEMPLATES} onSelect={onSelect} />);
    expect(screen.getAllByRole("button")).toHaveLength(TEMPLATES.length);

    const [first] = TEMPLATES;
    await userEvent.click(
      screen.getByRole("button", { name: `Создать проект по шаблону ${first.name}` }),
    );
    expect(onSelect).toHaveBeenCalledWith(first);
  });
});
