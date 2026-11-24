import type { IBlockVariant } from "../defineBlock";
import type { HeroProps } from "./hero.schema";

export const HERO_TAGS = ["hero", "главный экран", "шапка", "обложка", "первый экран", "заголовок"];

export const HERO_VARIANTS: IBlockVariant[] = [
  { id: "centered", name: "По центру" },
  { id: "split", name: "Текст и картинка" },
];

export const HERO_DEFAULTS: HeroProps = {
  eyebrow: "Новое",
  title: "Запустите лендинг за один вечер",
  subtitle: "Соберите страницу из готовых секций, настройте цвета и получите чистый код.",
  ctaLabel: "Попробовать бесплатно",
  ctaHref: "#",
  secondaryLabel: "Узнать больше",
  secondaryHref: "#",
};
