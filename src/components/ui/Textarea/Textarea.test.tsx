import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Textarea from "./Textarea";

describe("Textarea", () => {
  it("связывает подпись и ошибку с полем", () => {
    render(<Textarea label="Описание" error="Заполните поле" defaultValue="" />);
    const field = screen.getByLabelText("Описание");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription("Заполните поле");
  });
});
