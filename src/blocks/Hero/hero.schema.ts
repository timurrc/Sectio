import { z } from "zod";

export const heroSchema = z.object({
  eyebrow: z.string().meta({ label: "Надзаголовок" }),
  title: z.string().min(1).meta({ label: "Заголовок", multiline: true }),
  subtitle: z.string().meta({ label: "Подзаголовок", multiline: true }),
  ctaLabel: z.string().min(1).meta({ label: "Текст кнопки" }),
  ctaHref: z.string().meta({ label: "Ссылка кнопки" }),
  secondaryLabel: z.string().meta({ label: "Текст второй кнопки" }),
  secondaryHref: z.string().meta({ label: "Ссылка второй кнопки" }),
});

export type HeroProps = z.infer<typeof heroSchema>;
