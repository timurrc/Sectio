import type { IBlockVariant } from "../defineBlock";
import type { NavbarProps } from "./navbar.schema";

export const NAVBAR_TAGS = ["navbar", "header", "навигация", "шапка", "меню", "хедер"];

export const NAVBAR_VARIANTS: IBlockVariant[] = [
  { id: "classic", name: "Классика" },
  { id: "centered", name: "По центру" },
];

export const NAVBAR_DEFAULTS: NavbarProps = {
  brand: "Sectio",
  links: [
    { label: "Возможности", href: "#features" },
    { label: "Тарифы", href: "#pricing" },
    { label: "Вопросы", href: "#faq" },
  ],
  ctaLabel: "Начать",
  ctaHref: "#",
};
