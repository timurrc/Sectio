import type { IBlockVariant } from "../defineBlock";
import type { FooterProps } from "./footer.schema";

export const FOOTER_TAGS = ["footer", "подвал", "футер", "контакты", "ссылки", "копирайт"];

export const FOOTER_VARIANTS: IBlockVariant[] = [
  { id: "columns", name: "Колонки" },
  { id: "minimal", name: "Минимальный" },
];

export const FOOTER_DEFAULTS: FooterProps = {
  brand: "Sectio",
  tagline: "Лендинги из готовых секций.",
  columns: [
    {
      title: "Продукт",
      links: [
        { label: "Возможности", href: "#" },
        { label: "Тарифы", href: "#" },
      ],
    },
    {
      title: "Компания",
      links: [
        { label: "О нас", href: "#" },
        { label: "Контакты", href: "#" },
      ],
    },
  ],
  copyright: "© 2026 Sectio. Все права защищены.",
};
