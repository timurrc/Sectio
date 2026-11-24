import Fuse, { type IFuseOptions } from "fuse.js";

export interface ISearchable {
  title: string;
  subtitle?: string;
  group: string;
  keywords: string[];
}

const OPTIONS: IFuseOptions<ISearchable> = {
  keys: [
    { name: "title", weight: 3 },
    { name: "keywords", weight: 2 },
    { name: "subtitle", weight: 1 },
    { name: "group", weight: 0.5 },
  ],
  // Терпит опечатку в слове, но не находит всё подряд
  threshold: 0.35,
  // Совпадение в середине названия так же хорошо, как в начале
  ignoreLocation: true,
};

/** Нечёткий поиск по пунктам. Пустой запрос — все пункты в исходном порядке */
export const searchItems = <T extends ISearchable>(items: T[], query: string): T[] => {
  const text = query.trim();
  if (!text) return items;
  return new Fuse(items, OPTIONS as IFuseOptions<T>).search(text).map((result) => result.item);
};
