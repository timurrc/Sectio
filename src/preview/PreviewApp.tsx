import { useEffect, useMemo, useState } from "react";
import { BLOCKS } from "@/blocks/registry";
import { themeToCss } from "@/editor/themeToCss";
import type { IDocument, ISection } from "@/types/document.types";
import { onParentMessage, sendToParent } from "./bridge";

/**
 * Одна секция. Props проходят safeParse; при ошибке рисуем defaults и сообщаем родителю,
 * чтобы тот показал toast (в iframe тостов нет).
 */
const SectionView = ({ section }: { section: ISection }) => {
  const block = BLOCKS[section.type];
  const parsed = useMemo(() => block?.schema.safeParse(section.props), [block, section.props]);
  const isInvalid = parsed?.success === false;

  useEffect(() => {
    if (isInvalid && block) {
      sendToParent({ type: "section:invalid", id: section.id, blockName: block.name });
    }
  }, [isInvalid, block, section.id]);

  if (!block) return null;

  const props = parsed?.success ? parsed.data : block.defaults;
  const variant = block.variants.some((item) => item.id === section.variant)
    ? section.variant
    : block.variants[0].id;
  const Component = block.Component;

  return (
    <div data-section-id={section.id} className={section.theme === "dark" ? "dark" : undefined}>
      <Component props={props} variant={variant} />
    </div>
  );
};

/** Превью лендинга. Состояния секций здесь нет: рисуем то, что прислал редактор */
const PreviewApp = () => {
  const [doc, setDoc] = useState<IDocument | null>(null);

  useEffect(() => {
    const off = onParentMessage((message) => {
      if (message.type === "doc:set") setDoc(message.document);
    });
    sendToParent({ type: "ready" });
    return off;
  }, []);

  // Ссылки в превью не должны уводить iframe со страницы
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a")) event.preventDefault();
    };
    window.document.addEventListener("click", onClick);
    return () => window.document.removeEventListener("click", onClick);
  }, []);

  if (!doc) return null;

  return (
    <>
      <style>{themeToCss(doc.theme)}</style>
      {doc.sections.length === 0 ? (
        <p className="py-24 text-center text-[var(--color-muted)]">
          Добавьте первую секцию из библиотеки слева
        </p>
      ) : (
        <main>
          {doc.sections.map((section) => (
            <SectionView key={section.id} section={section} />
          ))}
        </main>
      )}
    </>
  );
};

export default PreviewApp;
