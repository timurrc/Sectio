import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { describe, expect, it } from "vitest";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("показывает заголовок, описание и действие", () => {
    render(
      <EmptyState
        icon={Inbox}
        title="Пусто"
        description="Добавьте первый блок"
        action={<button type="button">Добавить</button>}
      />,
    );
    expect(screen.getByRole("heading", { name: "Пусто" })).toBeInTheDocument();
    expect(screen.getByText("Добавьте первый блок")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Добавить" })).toBeInTheDocument();
  });
});
