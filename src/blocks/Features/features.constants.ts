import type { IBlockVariant } from "../defineBlock";
import type { FeaturesProps } from "./features.schema";

export const FEATURES_TAGS = [
  "features",
  "преимущества",
  "возможности",
  "функции",
  "плюсы",
  "почему мы",
];

export const FEATURES_VARIANTS: IBlockVariant[] = [
  { id: "grid", name: "Сетка карточек" },
  { id: "list", name: "Список" },
];

export const FEATURES_DEFAULTS: FeaturesProps = {
  title: "Всё, что нужно для старта",
  subtitle: "Короткий рассказ о том, чем продукт полезен.",
  items: [
    { title: "Быстро", description: "Первая версия страницы готова за несколько минут." },
    { title: "Гибко", description: "Меняйте тексты, цвета и порядок секций без кода." },
    { title: "Чисто", description: "Экспортируйте проект, который приятно читать и дорабатывать." },
  ],
};
