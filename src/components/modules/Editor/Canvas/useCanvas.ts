import { useCallback, useEffect, useRef, useState } from "react";
import { useDndMonitor, useDroppable, type DragMoveEvent } from "@dnd-kit/core";
import { toast } from "sonner";
import { runHotkeyAction } from "@/editor/commands";
import { createSection } from "@/editor/documentFactory";
import {
  CANVAS_DROP_ID,
  getAutoScrollDelta,
  getDropIndex,
  getSectionMove,
  type DragData,
} from "@/editor/dnd";
import { matchHotkey } from "@/editor/hotkeys";
import { isPreviewMessage, wrap, type ISectionRect, type ParentToPreview } from "@/editor/protocol";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";

/** Курсор в момент события dnd-kit: точка старта + смещение */
const pointerY = (event: DragMoveEvent) => {
  const start = event.activatorEvent as PointerEvent | MouseEvent;
  return "clientY" in start ? start.clientY + event.delta.y : null;
};

/**
 * Связь с iframe-превью. Модель живёт в document.store и уходит в iframe сообщением doc:set,
 * выделение и наведение — selection:set / hover:set. Принимаем сообщения только от нашего iframe
 * и нашего origin. Здесь же приём блока, перетащенного из библиотеки на холст.
 */
export const useCanvas = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const warnedRef = useRef(new Set<string>());
  const rectsRef = useRef<ISectionRect[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDraggingBlock, setIsDraggingBlock] = useState(false);
  const [drop, setDropState] = useState<{ index: number; lineY: number } | null>(null);
  // onDragEnd читает позицию из ref: обработчик монитора может быть из прошлого рендера
  const dropRef = useRef(drop);
  // Секция, которую тянут прямо в превью, и куда встанет (null — на своё место)
  const [sectionDrag, setSectionDrag] = useState<{ id: string; lineY: number | null } | null>(null);
  // y курсора над iframe, пока из библиотеки тянут блок: для автопрокрутки и пересчёта линии
  const libraryYRef = useRef<number | null>(null);
  const setDrop = useCallback((next: { index: number; lineY: number } | null) => {
    dropRef.current = next;
    setDropState(next);
  }, []);

  const document = useDocumentStore((state) => state.document);
  const viewport = useEditorStore((state) => state.viewport);
  const selectedId = useEditorStore((state) => state.selectedId);
  const hoveredId = useEditorStore((state) => state.hoveredId);

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: CANVAS_DROP_ID });

  const post = useCallback((message: ParentToPreview) => {
    iframeRef.current?.contentWindow?.postMessage(wrap(message), window.location.origin);
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (!isPreviewMessage(event.data)) return;

      const message = event.data;
      switch (message.type) {
        case "ready": {
          setIsReady(true);
          // iframe мог перезагрузиться (HMR): отдаём ему актуальное состояние сразу
          const current = useDocumentStore.getState().document;
          const editor = useEditorStore.getState();
          if (current) post({ type: "doc:set", document: current });
          post({ type: "selection:set", id: editor.selectedId });
          break;
        }
        case "section:click":
          useEditorStore.getState().select(message.id);
          break;
        case "section:hover":
          useEditorStore.getState().hover(message.id);
          break;
        case "section:rects":
          rectsRef.current = message.rects;
          // Превью прокрутилось под неподвижным курсором: линия вставки должна сдвинуться
          if (libraryYRef.current !== null) {
            setDrop(getDropIndex(message.rects, libraryYRef.current));
          }
          break;
        case "section:drag": {
          const move = getSectionMove(rectsRef.current, message.id, message.y);
          setSectionDrag({ id: message.id, lineY: move?.lineY ?? null });
          break;
        }
        case "section:drop": {
          const move = getSectionMove(rectsRef.current, message.id, message.y);
          if (move) useDocumentStore.getState().moveSection(message.id, move.toIndex);
          useEditorStore.getState().select(message.id);
          setSectionDrag(null);
          break;
        }
        case "section:drag-cancel":
          setSectionDrag(null);
          break;
        case "hotkey": {
          const action = matchHotkey(message.event);
          if (action) runHotkeyAction(action);
          break;
        }
        case "section:invalid": {
          const { id, blockName } = message;
          if (warnedRef.current.has(id)) break;
          warnedRef.current.add(id);
          toast.error(`Секция «${blockName}»: данные некорректны, показаны значения по умолчанию`);
          break;
        }
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [post, setDrop]);

  // Любое изменение модели сразу уходит в превью
  useEffect(() => {
    if (isReady && document) post({ type: "doc:set", document });
  }, [isReady, document, post]);

  useEffect(() => {
    if (isReady) post({ type: "selection:set", id: selectedId });
  }, [isReady, selectedId, post]);

  useEffect(() => {
    if (isReady) post({ type: "hover:set", id: hoveredId });
  }, [isReady, hoveredId, post]);

  const isLibraryDrag = (data: unknown): data is Extract<DragData, { kind: "library" }> =>
    (data as DragData | undefined)?.kind === "library";

  useDndMonitor({
    onDragStart: ({ active }) => setIsDraggingBlock(isLibraryDrag(active.data.current)),
    onDragMove: (event) => {
      if (!isLibraryDrag(event.active.data.current)) return;
      const y = pointerY(event);
      const frame = iframeRef.current?.getBoundingClientRect();
      if (y === null || !frame || event.over?.id !== CANVAS_DROP_ID) {
        libraryYRef.current = null;
        setDrop(null);
        return;
      }
      libraryYRef.current = y - frame.top;
      setDrop(getDropIndex(rectsRef.current, y - frame.top));
    },
    onDragEnd: ({ active, over }) => {
      const data = active.data.current;
      const target = dropRef.current;
      if (isLibraryDrag(data) && over?.id === CANVAS_DROP_ID && target) {
        const section = createSection(data.type);
        useDocumentStore.getState().insertSection(section, target.index);
        useEditorStore.getState().select(section.id);
      }
      setIsDraggingBlock(false);
      libraryYRef.current = null;
      setDrop(null);
    },
    onDragCancel: () => {
      setIsDraggingBlock(false);
      libraryYRef.current = null;
      setDrop(null);
    },
  });

  // Блок из библиотеки подносят к краю холста — превью прокручивается само
  useEffect(() => {
    if (!isDraggingBlock) return;
    let frame = 0;
    const tick = () => {
      const y = libraryYRef.current;
      const height = iframeRef.current?.clientHeight ?? 0;
      const dy = y === null ? 0 : getAutoScrollDelta(y, height);
      if (dy !== 0) post({ type: "scroll:by", dy });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isDraggingBlock, post]);

  return {
    iframeRef,
    viewport,
    isReady,
    setDropRef,
    isDraggingBlock,
    dropLineY: isOver ? (drop?.lineY ?? null) : (sectionDrag?.lineY ?? null),
    isDraggingSection: sectionDrag !== null,
  };
};
