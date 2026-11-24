import type { ISection } from "@/types/document.types";

const toPascal = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");

/**
 * Имена компонентов секций по порядку: Hero, Features, Hero2…
 * Имя же — имя файла в src/sections, поэтому оно должно быть уникальным.
 */
export const sectionComponentNames = (sections: Pick<ISection, "id" | "type">[]) => {
  const counters = new Map<string, number>();
  return new Map(
    sections.map((section) => {
      const base = toPascal(section.type) || "Section";
      const count = (counters.get(base) ?? 0) + 1;
      counters.set(base, count);
      return [section.id, count === 1 ? base : `${base}${count}`];
    }),
  );
};
