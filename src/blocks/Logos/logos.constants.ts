import type { IBlockVariant } from "../defineBlock";
import type { LogosProps } from "./logos.schema";

export const LOGOS_TAGS = [
  "logos",
  "логотипы",
  "клиенты",
  "партнёры",
  "партнеры",
  "компании",
  "доверие",
];

export const LOGOS_VARIANTS: IBlockVariant[] = [
  { id: "row", name: "Строка" },
  { id: "grid", name: "Сетка" },
];

export const LOGOS_DEFAULTS: LogosProps = {
  title: "Нам доверяют команды из сотен компаний",
  logos: ["Northwind", "Acme", "Globex", "Initech", "Umbrella", "Hooli"],
};
