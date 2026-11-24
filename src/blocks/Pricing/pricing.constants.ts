import type { IBlockVariant } from "../defineBlock";
import type { PricingProps } from "./pricing.schema";

export const PRICING_TAGS = ["pricing", "тарифы", "цены", "plans", "подписка", "стоимость"];

export const PRICING_VARIANTS: IBlockVariant[] = [
  { id: "cards", name: "Карточки" },
  { id: "table", name: "Таблица" },
];

export const PRICING_DEFAULTS: PricingProps = {
  title: "Простые и понятные тарифы",
  subtitle: "Начните бесплатно, переходите на платный план, когда будете готовы.",
  plans: [
    {
      name: "Старт",
      price: "0 ₽",
      period: "/мес",
      description: "Для первых экспериментов",
      features: ["1 проект", "Базовые блоки", "Экспорт в zip"],
      ctaLabel: "Начать",
      highlighted: false,
    },
    {
      name: "Про",
      price: "990 ₽",
      period: "/мес",
      description: "Для небольших команд",
      features: ["Безлимит проектов", "Все блоки", "Свои цвета и шрифты"],
      ctaLabel: "Выбрать Про",
      highlighted: true,
    },
    {
      name: "Бизнес",
      price: "2 990 ₽",
      period: "/мес",
      description: "Для агентств",
      features: ["Всё из Про", "Командная работа", "Приоритетная поддержка"],
      ctaLabel: "Связаться",
      highlighted: false,
    },
  ],
};
