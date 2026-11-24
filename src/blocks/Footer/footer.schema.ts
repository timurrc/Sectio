import { z } from "zod";
import { linkSchema } from "../shared/link";

export const footerSchema = z.object({
  brand: z.string().min(1).meta({ label: "Название бренда" }),
  tagline: z.string().meta({ label: "Слоган", multiline: true }),
  columns: z
    .array(
      z.object({
        title: z.string().min(1).meta({ label: "Заголовок колонки" }),
        links: z
          .array(
            z.object({
              label: z.string().min(1).meta({ label: "Текст" }),
              href: linkSchema().meta({ label: "Адрес" }),
            }),
          )
          .meta({ label: "Ссылки", itemLabel: "Ссылка" }),
      }),
    )
    .max(4)
    .meta({ label: "Колонки", itemLabel: "Колонка" }),
  copyright: z.string().meta({ label: "Копирайт" }),
});

export type FooterProps = z.infer<typeof footerSchema>;
