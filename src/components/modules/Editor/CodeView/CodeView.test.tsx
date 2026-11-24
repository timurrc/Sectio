import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDocument, createSection } from "@/core/documentFactory";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import CodeView from "./CodeView";

// Monaco в jsdom не работает: проверяем, какой файл и код ему передаются
vi.mock("./CodeEditor", () => ({
  default: ({ path, code }: { path: string; code: string }) => (
    <pre data-testid="code" data-path={path}>
      {code}
    </pre>
  ),
}));

const setup = () => {
  const doc = createDocument("Тест");
  doc.sections = [createSection("hero"), createSection("cta", { variant: "simple" })];
  useDocumentStore.getState().setDocument(doc);
  useEditorStore.getState().reset();
  return doc;
};

describe("CodeView", () => {
  beforeEach(() => {
    useDocumentStore.getState().setDocument(null);
  });

  it("показывает дерево файлов и по умолчанию App.tsx", async () => {
    setup();
    render(<CodeView />);

    const code = await screen.findByTestId("code", {}, { timeout: 3000 });
    expect(code).toHaveAttribute("data-path", "src/App.tsx");
    expect(code.textContent).toContain("<Hero />");

    const tree = screen.getByRole("list", { name: "Файлы проекта" });
    expect(within(tree).getByRole("button", { name: "Cta.tsx" })).toBeInTheDocument();
    expect(within(tree).getByRole("button", { name: "package.json" })).toBeInTheDocument();
  });

  it("открывает файл выделенной секции и файл из дерева", async () => {
    const doc = setup();
    render(<CodeView />);
    await screen.findByTestId("code", {}, { timeout: 3000 });

    act(() => useEditorStore.getState().select(doc.sections[1].id));
    expect(screen.getByTestId("code")).toHaveAttribute("data-path", "src/sections/Cta.tsx");
    expect(screen.getByTestId("code").textContent).toContain("Готовы начать?");

    await userEvent.click(screen.getByRole("button", { name: "index.css" }));
    expect(screen.getByTestId("code")).toHaveAttribute("data-path", "src/index.css");
  });
});
