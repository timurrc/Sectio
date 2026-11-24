import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { createDocument, createSection } from "@/editor/documentFactory";
import { useDocumentStore } from "@/store/document.store";
import type { BlockType, ISection } from "@/types/document.types";
import Inspector from "./Inspector";

const setup = (type: BlockType) => {
  const section = createSection(type);
  useDocumentStore.getState().setDocument({ ...createDocument(), sections: [section] });
  const Connected = () => {
    const current = useDocumentStore((state) => state.document?.sections[0]) as ISection;
    return <Inspector section={current} />;
  };
  render(<Connected />);
  return section.id;
};

const props = <T,>() => useDocumentStore.getState().document?.sections[0].props as T;

beforeEach(() => useDocumentStore.getState().setDocument(null));

describe("Inspector", () => {
  it("строит форму по схеме и пишет правки в модель", async () => {
    setup("cta");
    const title = screen.getByLabelText(/Заголовок/);
    await userEvent.clear(title);
    await userEvent.type(title, "Попробуйте");
    expect(props<{ title: string }>().title).toBe("Попробуйте");
  });

  it("невалидный черновик не попадает в модель и показывает ошибку", async () => {
    setup("cta");
    const before = props<{ title: string }>().title;
    await userEvent.clear(screen.getByLabelText(/Заголовок/));

    expect(screen.getByText("Заполните поле")).toBeInTheDocument();
    expect(props<{ title: string }>().title).toBe(before);
  });

  it("меняет вариант и тему секции", async () => {
    setup("hero");
    await userEvent.click(screen.getByRole("radio", { name: "Тёмная" }));
    expect(useDocumentStore.getState().document?.sections[0].theme).toBe("dark");
  });

  it("списки строк: добавление и удаление пунктов (features в Pricing)", async () => {
    setup("pricing");
    const count = () => props<{ plans: { features: string[] }[] }>().plans[0].features.length;
    const before = count();

    await userEvent.click(screen.getAllByText(/^Тариф 1/)[0]);
    await userEvent.click(screen.getAllByRole("button", { name: "Добавить пункт" })[0]);
    expect(count()).toBe(before + 1);

    await userEvent.click(screen.getAllByRole("button", { name: "Удалить: Пункт 1" })[0]);
    expect(count()).toBe(before);
  });

  it("undo пересобирает черновик из модели", async () => {
    setup("cta");
    const title = screen.getByLabelText(/Заголовок/) as HTMLInputElement;
    const before = title.value;
    await userEvent.type(title, "!");
    act(() => useDocumentStore.temporal.getState().undo());
    expect(title.value).toBe(before);
  });
});
