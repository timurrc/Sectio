import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { getPaletteItems, type IPaletteItem } from "@/core/palette";
import { searchItems } from "@/core/search";
import { useEditorStore } from "@/store/editor.store";

/** Атрибут кнопки, открывающей палитру: на неё возвращается фокус */
export const PALETTE_TRIGGER_ATTR = "data-palette-trigger";

/** Сколько пунктов показываем: длинный хвост нечёткого поиска только мешает */
const MAX_RESULTS = 40;

export const useCommandPalette = () => {
  const setPaletteOpen = useEditorStore((state) => state.setPaletteOpen);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  // Пункты собираются один раз при открытии: действия зависят от выделения в этот момент
  const [items] = useState(getPaletteItems);
  const results = useMemo(() => searchItems(items, query).slice(0, MAX_RESULTS), [items, query]);
  const activeItem = results[Math.min(activeIndex, results.length - 1)];

  // Фокус возвращается туда, откуда палитру открыли. Если того элемента уже нет
  // (вставка блока пересоздала инспектор) — на кнопку палитры, а не в никуда
  const returnFocus = useRef<Element | null>(null);
  useEffect(() => {
    returnFocus.current = document.activeElement;
    return () => {
      const target = returnFocus.current?.isConnected
        ? returnFocus.current
        : document.querySelector(`[${PALETTE_TRIGGER_ATTR}]`);
      if (target instanceof HTMLElement) target.focus();
    };
  }, []);

  const close = () => setPaletteOpen(false);

  const run = (item: IPaletteItem | undefined) => {
    if (!item) return;
    close();
    item.run();
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = results.length;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (count) setActiveIndex((index) => (index + 1) % count);
        return;
      case "ArrowUp":
        event.preventDefault();
        if (count) setActiveIndex((index) => (index - 1 + count) % count);
        return;
      case "Enter":
        event.preventDefault();
        run(activeItem);
        return;
      case "Escape":
        event.preventDefault();
        close();
        return;
    }
    // Повторный ⌘K закрывает палитру
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      close();
    }
  };

  const optionId = (item: IPaletteItem) => `${listId}-${item.id}`;

  return {
    listId,
    query,
    changeQuery,
    results,
    activeItem,
    setActiveIndex,
    onKeyDown,
    run,
    close,
    optionId,
  };
};
