import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { matchHotkey, toHotkeyEvent } from "@/editor/hotkeys";
import { resolveSection } from "@/editor/resolveSection";
import { themeToCss } from "@/editor/themeToCss";
import type { IDocument, ISection } from "@/types/document.types";
import { onParentMessage, sendToParent } from "./bridge";
import { collectSectionRects, sectionIdFrom } from "./sectionDom";
import { startSectionDrag } from "./sectionDrag";

interface SectionViewProps {
  section: ISection;
  isSelected: boolean;
  isHovered: boolean;
}

/**
 * Одна секция. Props проходят safeParse; при ошибке рисуем defaults и сообщаем родителю,
 * чтобы тот показал toast (в iframe тостов нет).
 * data-selected / data-hovered — только рамка редактора (preview.css), в экспорт не попадают.
 */
const SectionView = ({ section, isSelected, isHovered }: SectionViewProps) => {
  const resolved = useMemo(() => resolveSection(section), [section]);
  const isInvalid = resolved?.isValid === false;
  const blockName = resolved?.block.name;

  useEffect(() => {
    if (isInvalid && blockName) {
      sendToParent({ type: "section:invalid", id: section.id, blockName });
    }
  }, [isInvalid, blockName, section.id]);

  if (!resolved) return null;

  const { block, props, variant } = resolved;
  const Component = block.Component;

  return (
    <div
      data-section-id={section.id}
      data-label={block.name}
      data-selected={isSelected || undefined}
      data-hovered={isHovered || undefined}
      className={section.theme === "dark" ? "dark" : undefined}
    >
      <Component props={props} variant={variant} />
    </div>
  );
};

/** Превью лендинга. Состояния секций здесь нет: рисуем то, что прислал редактор */
const PreviewApp = () => {
  const [doc, setDoc] = useState<IDocument | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const off = onParentMessage((message) => {
      switch (message.type) {
        case "doc:set":
          setDoc(message.document);
          break;
        case "selection:set":
          setSelectedId(message.id);
          break;
        case "hover:set":
          setHoveredId(message.id);
          break;
        case "scroll:by":
          window.scrollBy(0, message.dy);
          break;
      }
    });
    sendToParent({ type: "ready" });
    return off;
  }, []);

  // Секцию можно зажать и перетащить: порядок меняет редактор по section:drop
  useEffect(() => startSectionDrag(sendToParent), []);

  // Клик выбирает секцию; ссылки в превью не должны уводить iframe со страницы
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a")) event.preventDefault();
      const id = sectionIdFrom(event.target);
      if (id) sendToParent({ type: "section:click", id });
    };

    let lastHover: string | null = null;
    const reportHover = (id: string | null) => {
      if (id === lastHover) return;
      lastHover = id;
      sendToParent({ type: "section:hover", id });
    };
    const onOver = (event: MouseEvent) => reportHover(sectionIdFrom(event.target));
    const onLeave = () => reportHover(null);

    // Фокус после клика остаётся в iframe — хоткеи редактора пересылаем родителю
    const onKeyDown = (event: KeyboardEvent) => {
      const hotkey = toHotkeyEvent(event);
      if (!matchHotkey(hotkey)) return;
      event.preventDefault();
      sendToParent({ type: "hotkey", event: hotkey });
    };

    const root = window.document;
    root.addEventListener("click", onClick);
    root.addEventListener("mouseover", onOver);
    root.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("mouseover", onOver);
      root.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Положения секций нужны родителю для вставки перетаскиванием на холст
  useLayoutEffect(() => {
    if (!doc) return;
    const report = () => sendToParent({ type: "section:rects", rects: collectSectionRects() });
    report();

    const observer = new ResizeObserver(report);
    observer.observe(window.document.body);
    window.addEventListener("scroll", report, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", report);
    };
  }, [doc]);

  // Секцию, выбранную в Outline, показываем в видимой области
  useEffect(() => {
    if (!selectedId) return;
    window.document
      .querySelector(`[data-section-id="${CSS.escape(selectedId)}"]`)
      ?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  if (!doc) return null;

  return (
    <>
      <style>{themeToCss(doc.theme)}</style>
      {doc.sections.length === 0 ? (
        <p className="py-24 text-center text-[var(--color-muted)]">
          Перетащите блок сюда или кликните по нему в библиотеке слева
        </p>
      ) : (
        <main>
          {doc.sections.map((section) => (
            <SectionView
              key={section.id}
              section={section}
              isSelected={section.id === selectedId}
              isHovered={section.id === hoveredId}
            />
          ))}
        </main>
      )}
    </>
  );
};

export default PreviewApp;
