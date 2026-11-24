import { z } from "zod";

export const navbarSchema = z.object({
  brand: z.string().min(1).meta({ label: "Название бренда" }),
  links: z
    .array(
      z.object({
        label: z.string().min(1).meta({ label: "Текст" }),
        href: z.string().meta({ label: "Адрес" }),
      }),
    )
    .max(6)
    .meta({ label: "Ссылки", itemLabel: "Ссылка" }),
  ctaLabel: z.string().meta({ label: "Текст кнопки" }),
  ctaHref: z.string().meta({ label: "Ссылка кнопки" }),
});

export type NavbarProps = z.infer<typeof navbarSchema>;
