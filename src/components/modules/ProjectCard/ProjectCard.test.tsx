import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProjectCard from "./ProjectCard";

const setup = () => {
  const onDelete = vi.fn();
  const onOpen = vi.fn();
  render(
    <ProjectCard title="Лендинг" updatedAt={Date.now()} onOpen={onOpen} onDelete={onDelete} />,
  );
  return { onDelete, onOpen };
};

describe("ProjectCard", () => {
  it("открывает проект по клику на превью", async () => {
    const { onOpen } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Открыть проект Лендинг" }));
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("удаляет только после подтверждения", async () => {
    const { onDelete } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Удалить проект Лендинг" }));
    expect(onDelete).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Удалить" }));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("отмена возвращает кнопку удаления", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Удалить проект Лендинг" }));
    await userEvent.click(screen.getByRole("button", { name: "Отмена" }));
    expect(screen.getByRole("button", { name: "Удалить проект Лендинг" })).toBeInTheDocument();
  });
});
