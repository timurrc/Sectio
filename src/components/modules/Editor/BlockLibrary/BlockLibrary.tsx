import { useDraggable } from "@dnd-kit/core";
import { BLOCKS, type AnyBlockDefinition } from "@/blocks/registry";
import { addSection } from "@/editor/commands";
import type { DragData } from "@/editor/dnd";
import BlockThumbnail from "./BlockThumbnail";

const LibraryCard = ({ block }: { block: AnyBlockDefinition }) => {
  const data: DragData = { kind: "library", type: block.type };
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: `library:${block.type}`,
    data,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      aria-label={`Добавить блок ${block.name}`}
      aria-roledescription="перетаскиваемый блок"
      onClick={() => addSection(block.type)}
      className="flex w-full cursor-grab flex-col gap-1.5 rounded-xl border border-[var(--color-border)] p-1.5 text-left transition-colors hover:border-[var(--color-primary)] data-[dragging=true]:opacity-50"
      data-dragging={isDragging}
    >
      <BlockThumbnail type={block.type} />
      <span className="px-1 pb-0.5 text-sm font-medium">{block.name}</span>
    </button>
  );
};

/** Библиотека блоков: клик — добавить, перетаскивание — вставить в нужное место холста */
const BlockLibrary = () => {
  const blocks = Object.values(BLOCKS);

  return (
    <div className="flex flex-col gap-3">
      <p className="px-1 text-sm text-[var(--color-muted)]">Кликните или перетащите на холст</p>
      <ul className="grid grid-cols-2 gap-2">
        {blocks.map((block) => (
          <li key={block.type}>
            <LibraryCard block={block} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockLibrary;
