import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("вызывает onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ок</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Ок" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("блокируется во время загрузки", () => {
    render(<Button isLoading>Ок</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
