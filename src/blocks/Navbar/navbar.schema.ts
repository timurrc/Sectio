import { z } from "zod";
import { linkSchema } from "../shared/link";

export const navbarSchema = z.object({
  brand: z.string().min(1).meta({ label: "Название бренда" }),
  links: z
    .array(
      z.object({
        label: z.string().min(1).meta({ label: "Текст" }),
        href: linkSchema().meta({ label: "Адрес" }),
      }),
    )
    .max(6)
    .meta({ label: "Ссылки", itemLabel: "Ссылка" }),
  ctaLabel: z.string().meta({ label: "Текст кнопки" }),
  ctaHref: linkSchema().meta({ label: "Ссылка кнопки" }),
});

export type NavbarProps = z.infer<typeof navbarSchema>;
