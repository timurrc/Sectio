import Tabs from "@/components/ui/Tabs/Tabs";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore, type LeftPanel as LeftPanelId } from "@/store/editor.store";
import BlockLibrary from "../BlockLibrary/BlockLibrary";
import Outline from "../Outline/Outline";

/** Левая панель: библиотека блоков и структура страницы */
const LeftPanel = () => {
  const panel = useEditorStore((state) => state.leftPanel);
  const setPanel = useEditorStore((state) => state.setLeftPanel);
  const count = useDocumentStore((state) => state.document?.sections.length ?? 0);

  const items: { id: LeftPanelId; label: string }[] = [
    { id: "blocks", label: "Блоки" },
    { id: "outline", label: count ? `Структура · ${count}` : "Структура" },
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--color-border)]">
      <Tabs
        label="Левая панель"
        value={panel}
        items={items}
        onChange={setPanel}
        className="border-b border-[var(--color-border)] px-4 pt-3"
      />
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {panel === "blocks" ? <BlockLibrary /> : <Outline />}
      </div>
    </aside>
  );
};

export default LeftPanel;
