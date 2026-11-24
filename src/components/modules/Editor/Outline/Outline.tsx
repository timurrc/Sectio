import { useDndMonitor, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, LayoutList, Moon, Trash2 } from "lucide-react";
import { getBlock } from "@/blocks/registry";
import Button from "@/components/ui/Button/Button";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import { duplicateSectionById, removeSectionById } from "@/editor/commands";
import type { DragData } from "@/editor/dnd";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import type { ISection } from "@/types/document.types";
import { cn } from "@/utils/cn";

const OutlineItem = ({ section }: { section: ISection }) => {
  const data: DragData = { kind: "section" };
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, data });
  const isSelected = useEditorStore((state) => state.selectedId === section.id);
  const isHovered = useEditorStore((state) => state.hoveredId === section.id);
  const select = useEditorStore((state) => state.select);
  const hover = useEditorStore((state) => state.hover);

  const block = getBlock(section.type);
  const variant = block.variants.find((item) => item.id === section.variant)?.name;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      onMouseEnter={() => hover(section.id)}
      onMouseLeave={() => hover(null)}
      className={cn(
        "group relative flex items-center gap-1 rounded-xl pr-1 transition-colors",
        isHovered && "bg-[var(--color-surface)]",
        isSelected && "bg-[var(--color-surface)] ring-1 ring-[var(--color-primary)]",
        isDragging && "z-10 opacity-80 shadow-md",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Перетащить: ${block.name}`}
        className="flex h-10 w-6 shrink-0 cursor-grab items-center justify-center text-[var(--color-muted)] active:cursor-grabbing"
      >
        <GripVertical className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => select(section.id)}
        aria-current={isSelected || undefined}
        className="flex min-w-0 flex-1 cursor-pointer flex-col py-1.5 text-left"
      >
        <span className="flex items-center gap-1.5 truncate text-sm font-medium">
          {block.name}
          {section.theme === "dark" && (
            <Moon className="size-3 text-[var(--color-muted)]" aria-label="тёмная" />
          )}
        </span>
        {variant && <span className="truncate text-xs text-[var(--color-muted)]">{variant}</span>}
      </button>
      <div className="flex opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => duplicateSectionById(section.id)}
          aria-label={`Дублировать: ${block.name}`}
        >
          <Copy className="size-3.5" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeSectionById(section.id)}
          aria-label={`Удалить: ${block.name}`}
        >
          <Trash2 className="size-3.5" aria-hidden />
        </Button>
      </div>
    </li>
  );
};

/** Структура страницы: порядок секций, выбор, перетаскивание, быстрые действия */
const Outline = () => {
  const sections = useDocumentStore((state) => state.document?.sections) ?? [];
  const moveSection = useDocumentStore((state) => state.moveSection);
  const setLeftPanel = useEditorStore((state) => state.setLeftPanel);

  useDndMonitor({
    onDragEnd: ({ active, over }: DragEndEvent) => {
      if ((active.data.current as DragData | undefined)?.kind !== "section") return;
      if (!over || active.id === over.id) return;
      const to = sections.findIndex((section) => section.id === over.id);
      if (to !== -1) moveSection(String(active.id), to);
    },
  });

  if (sections.length === 0) {
    return (
      <EmptyState
        icon={LayoutList}
        title="Секций пока нет"
        description="Добавьте блоки из библиотеки — здесь появится их порядок."
        action={
          <Button variant="outline" size="sm" onClick={() => setLeftPanel("blocks")}>
            Открыть библиотеку
          </Button>
        }
      />
    );
  }

  return (
    <SortableContext
      items={sections.map((section) => section.id)}
      strategy={verticalListSortingStrategy}
    >
      <ul aria-label="Секции страницы" className="flex flex-col gap-0.5">
        {sections.map((section) => (
          <OutlineItem key={section.id} section={section} />
        ))}
      </ul>
    </SortableContext>
  );
};

export default Outline;
