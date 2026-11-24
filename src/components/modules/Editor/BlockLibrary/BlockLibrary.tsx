import { Plus } from "lucide-react";
import { BLOCKS } from "@/blocks/registry";
import { createSection } from "@/editor/documentFactory";
import { useDocumentStore } from "@/store/document.store";

/** Библиотека блоков. Пока клик добавляет секцию в конец; DnD и «после выбранной» — этап 2 */
const BlockLibrary = () => {
  const insertSection = useDocumentStore((state) => state.insertSection);
  const blocks = Object.values(BLOCKS);

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-2 overflow-y-auto border-r border-[var(--color-border)] p-3">
      <h2 className="px-1 text-sm font-medium text-[var(--color-muted)]">Блоки</h2>
      {blocks.map((block) => (
        <button
          key={block.type}
          type="button"
          onClick={() => insertSection(createSection(block.type))}
          className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2 text-left transition-colors hover:bg-[var(--color-surface)]"
        >
          <span>
            <span className="block text-sm font-medium">{block.name}</span>
            <span className="text-xs text-[var(--color-muted)]">
              Вариантов: {block.variants.length}
            </span>
          </span>
          <Plus className="size-4 text-[var(--color-muted)]" aria-hidden />
        </button>
      ))}
    </aside>
  );
};

export default BlockLibrary;
