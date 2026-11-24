import type { IBlockVariant } from "../defineBlock";
import type { CtaProps } from "./cta.schema";

export const CTA_TAGS = ["cta", "призыв", "призыв к действию", "кнопка", "подписка", "регистрация"];

export const CTA_VARIANTS: IBlockVariant[] = [
  { id: "banner", name: "Цветной баннер" },
  { id: "simple", name: "Простой" },
];

export const CTA_DEFAULTS: CtaProps = {
  title: "Готовы начать?",
  subtitle: "Создайте первую страницу прямо сейчас — это бесплатно.",
  ctaLabel: "Создать лендинг",
  ctaHref: "#",
};
