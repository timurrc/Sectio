import { useState, type ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { getBlock } from "@/blocks/registry";
import type { DragData } from "@/editor/dnd";
import { useEditorStore } from "@/store/editor.store";
import type { BlockType } from "@/types/document.types";

/**
 * Блок из библиотеки бросают только туда, где курсор (холст), иначе closestCenter
 * засчитал бы бросок «куда-нибудь». Сортировка Outline — по ближайшему элементу.
 */
const collisionDetection: CollisionDetection = (args) => {
  const data = args.active.data.current as DragData | undefined;
  if (data?.kind === "library") return pointerWithin(args);
  return closestCenter(args);
};

/**
 * Общий DndContext редактора. Источники и приёмники сами слушают события через useDndMonitor:
 * библиотека → холст (Canvas), сортировка секций (Outline). Здесь только сенсоры и «призрак».
 */
const EditorDnd = ({ children }: { children: ReactNode }) => {
  // Небольшой порог: клик по карточке блока остаётся кликом
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const [draggedBlock, setDraggedBlock] = useState<BlockType | null>(null);
  const setDragging = useEditorStore((state) => state.setDragging);

  const onDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current as DragData | undefined;
    setDraggedBlock(data?.kind === "library" ? data.type : null);
    setDragging(true);
  };
  const reset = () => {
    setDraggedBlock(null);
    setDragging(false);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      // Зона сброса над холстом появляется уже после старта перетаскивания — меряем всегда
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragEnd={reset}
      onDragCancel={reset}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {draggedBlock && (
          <div className="inline-flex cursor-grabbing items-center rounded-full bg-[var(--color-text)] px-3 py-1.5 text-sm font-medium text-[var(--color-bg)] shadow-lg">
            {getBlock(draggedBlock).name}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default EditorDnd;
