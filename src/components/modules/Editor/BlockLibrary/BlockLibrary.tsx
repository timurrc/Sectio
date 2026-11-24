import { BLOCKS } from "@/blocks/registry";
import { createSection } from "@/editor/documentFactory";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import BlockThumbnail from "./BlockThumbnail";

/** Библиотека блоков. Клик добавляет секцию после выбранной (или в конец); DnD — этап 2 */
const BlockLibrary = () => {
  const insertSection = useDocumentStore((state) => state.insertSection);
  const blocks = Object.values(BLOCKS);

  const handleAdd = (type: (typeof blocks)[number]["type"]) => {
    const { document } = useDocumentStore.getState();
    const { selectedId } = useEditorStore.getState();
    const selectedIndex =
      document?.sections.findIndex((section) => section.id === selectedId) ?? -1;
    insertSection(createSection(type), selectedIndex === -1 ? undefined : selectedIndex + 1);
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-3 overflow-y-auto border-r border-[var(--color-border)] p-3">
      <h2 className="px-1 text-sm text-[var(--color-muted)]">Блоки</h2>
      <ul className="grid grid-cols-2 gap-2">
        {blocks.map((block) => (
          <li key={block.type}>
            <button
              type="button"
              aria-label={`Добавить блок ${block.name}`}
              onClick={() => handleAdd(block.type)}
              className="flex w-full cursor-pointer flex-col gap-1.5 rounded-xl border border-[var(--color-border)] p-1.5 text-left transition-colors hover:border-[var(--color-primary)]"
            >
              <BlockThumbnail type={block.type} />
              <span className="px-1 pb-0.5 text-sm font-medium">{block.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default BlockLibrary;
