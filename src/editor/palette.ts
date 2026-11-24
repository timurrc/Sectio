import { BLOCKS } from "@/blocks/registry";
import { VIEWPORTS } from "@/constants/editor";
import { TEMPLATES } from "@/constants/templates";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";
import {
  duplicateSectionById,
  moveSectionBy,
  removeSectionById,
  toggleSectionTheme,
  addSection,
} from "./commands";
import { HOTKEY_HINTS } from "./hotkeys";
import type { ISearchable } from "./search";
import { applyTemplate } from "./templates";

export type PaletteGroup = "Действия" | "Блоки" | "Шаблоны";

export interface IPaletteItem extends ISearchable {
  id: string;
  group: PaletteGroup;
  /** Клавиша, которая делает то же самое */
  hint?: string;
  run: () => void;
}

const sectionActions = (): IPaletteItem[] => {
  const { selectedId } = useEditorStore.getState();
  const sections = useDocumentStore.getState().document?.sections ?? [];
  const index = sections.findIndex((section) => section.id === selectedId);
  if (!selectedId || index === -1) return [];

  const section = sections[index];
  const blockName = BLOCKS[section.type]?.name ?? section.type;
  const isDark = section.theme === "dark";
  const items: Omit<IPaletteItem, "group">[] = [
    {
      id: "section:duplicate",
      title: "Дублировать секцию",
      keywords: ["копия", "copy", "duplicate"],
      hint: HOTKEY_HINTS.duplicate,
      run: () => duplicateSectionById(selectedId),
    },
    {
      id: "section:theme",
      title: isDark ? "Сделать секцию светлой" : "Сделать секцию тёмной",
      keywords: ["тема", "theme", "dark", "light", "тёмная", "светлая", "темная"],
      run: () => toggleSectionTheme(selectedId),
    },
  ];

  if (index > 0) {
    items.push({
      id: "section:up",
      title: "Поднять секцию выше",
      keywords: ["вверх", "переместить", "move up"],
      hint: HOTKEY_HINTS.moveUp,
      run: () => moveSectionBy(selectedId, -1),
    });
  }
  if (index < sections.length - 1) {
    items.push({
      id: "section:down",
      title: "Опустить секцию ниже",
      keywords: ["вниз", "переместить", "move down"],
      hint: HOTKEY_HINTS.moveDown,
      run: () => moveSectionBy(selectedId, 1),
    });
  }

  items.push(
    {
      id: "section:delete",
      title: "Удалить секцию",
      keywords: ["убрать", "delete", "remove"],
      hint: HOTKEY_HINTS.delete,
      run: () => removeSectionById(selectedId),
    },
    {
      id: "section:deselect",
      title: "Настройки страницы и темы",
      keywords: ["снять выделение", "тема", "цвета", "шрифт", "settings"],
      hint: HOTKEY_HINTS.deselect,
      run: () => useEditorStore.getState().select(null),
    },
  );

  // Все действия над секцией подписаны её блоком: видно, к чему применится команда
  return items.map((item) => ({ ...item, subtitle: blockName, group: "Действия" as const }));
};

const editorActions = (): IPaletteItem[] => {
  const { tab, viewport, setTab, setViewport } = useEditorStore.getState();
  const { pastStates, futureStates, undo, redo } = useDocumentStore.temporal.getState();
  const items: Omit<IPaletteItem, "group">[] = [];

  if (pastStates.length > 0) {
    items.push({
      id: "history:undo",
      title: "Отменить",
      keywords: ["undo", "назад"],
      hint: HOTKEY_HINTS.undo,
      run: undo,
    });
  }
  if (futureStates.length > 0) {
    items.push({
      id: "history:redo",
      title: "Повторить",
      keywords: ["redo", "вперёд"],
      hint: HOTKEY_HINTS.redo,
      run: redo,
    });
  }

  items.push(
    tab === "preview"
      ? {
          id: "tab:code",
          title: "Показать код",
          keywords: ["code", "код", "jsx", "экспорт"],
          run: () => setTab("code"),
        }
      : {
          id: "tab:preview",
          title: "Показать превью",
          keywords: ["preview", "превью", "холст"],
          run: () => setTab("preview"),
        },
  );

  for (const item of VIEWPORTS) {
    if (item.id === viewport && tab === "preview") continue;
    items.push({
      id: `viewport:${item.id}`,
      title: `Превью: ${item.label.toLowerCase()}`,
      keywords: ["viewport", "размер", "ширина", item.id],
      run: () => {
        setTab("preview");
        setViewport(item.id);
      },
    });
  }

  return items.map((item) => ({ ...item, group: "Действия" }));
};

/** Каждый вариант блока — отдельный пункт: «Отзывы · Крупные цитаты» */
const blockItems = (): IPaletteItem[] =>
  Object.values(BLOCKS).flatMap((block) =>
    block.variants.map((variant) => ({
      id: `block:${block.type}:${variant.id}`,
      group: "Блоки" as const,
      title: block.name,
      subtitle: variant.name,
      keywords: [block.type, ...block.tags],
      run: () => {
        addSection(block.type, variant.id);
      },
    })),
  );

const templateItems = (): IPaletteItem[] =>
  TEMPLATES.map((template) => ({
    id: `template:${template.id}`,
    group: "Шаблоны",
    title: `Шаблон «${template.name}»`,
    subtitle: "Заменит секции страницы",
    keywords: ["шаблон", "template", ...template.tags],
    run: () => applyTemplate(template),
  }));

/**
 * Пункты палитры по текущему состоянию редактора. Строятся при открытии:
 * действия зависят от выделения и истории, блоки и шаблоны — от реестра.
 */
export const getPaletteItems = (): IPaletteItem[] => [
  ...sectionActions(),
  ...editorActions(),
  ...blockItems(),
  ...templateItems(),
];
