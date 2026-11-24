import { z } from "zod";

export const testimonialsSchema = z.object({
  title: z.string().min(1).meta({ label: "Заголовок" }),
  subtitle: z.string().meta({ label: "Подзаголовок", multiline: true }),
  items: z
    .array(
      z.object({
        quote: z.string().min(1).meta({ label: "Цитата", multiline: true }),
        author: z.string().min(1).meta({ label: "Автор" }),
        role: z.string().meta({ label: "Должность" }),
      }),
    )
    .min(1)
    .max(6)
    .meta({ label: "Отзывы", itemLabel: "Отзыв" }),
});

export type TestimonialsProps = z.infer<typeof testimonialsSchema>;
