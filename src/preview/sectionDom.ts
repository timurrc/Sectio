import type { ISectionRect } from "@/core/protocol";

/** id секции, внутри которой находится элемент (или null) */
export const sectionIdFrom = (target: EventTarget | null): string | null =>
  target instanceof Element
    ? (target.closest<HTMLElement>("[data-section-id]")?.dataset.sectionId ?? null)
    : null;

/** Положения всех секций во вьюпорте iframe, по порядку документа */
export const collectSectionRects = (): ISectionRect[] =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-section-id]")).map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      id: element.dataset.sectionId ?? "",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  });
