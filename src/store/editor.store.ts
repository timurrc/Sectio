import { create } from "zustand";

export type Viewport = "desktop" | "tablet" | "mobile";
export type EditorTab = "preview" | "code";
export type LeftPanel = "blocks" | "outline";

interface EditorState {
  selectedId: string | null;
  hoveredId: string | null;
  viewport: Viewport;
  tab: EditorTab;
  leftPanel: LeftPanel;
  /** Идёт перетаскивание (мышью или с клавиатуры): хоткеи редактора молчат */
  isDragging: boolean;
  /** Открыта палитра команд ⌘K: хоткеи редактора молчат, клавиши принадлежат палитре */
  paletteOpen: boolean;
  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  setViewport: (viewport: Viewport) => void;
  setTab: (tab: EditorTab) => void;
  setLeftPanel: (panel: LeftPanel) => void;
  setDragging: (isDragging: boolean) => void;
  setPaletteOpen: (paletteOpen: boolean) => void;
  /** Сброс при открытии другого проекта */
  reset: () => void;
}

const INITIAL = {
  selectedId: null,
  hoveredId: null,
  viewport: "desktop" as Viewport,
  tab: "preview" as EditorTab,
  leftPanel: "blocks" as LeftPanel,
  isDragging: false,
  paletteOpen: false,
};

/** Состояние интерфейса редактора. Без истории: выделение и вьюпорт не отменяются через ⌘Z */
export const useEditorStore = create<EditorState>()((set) => ({
  ...INITIAL,
  select: (selectedId) => set({ selectedId }),
  hover: (hoveredId) => set({ hoveredId }),
  setViewport: (viewport) => set({ viewport }),
  setTab: (tab) => set({ tab }),
  setLeftPanel: (leftPanel) => set({ leftPanel }),
  setDragging: (isDragging) => set({ isDragging }),
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  reset: () => set(INITIAL),
}));
