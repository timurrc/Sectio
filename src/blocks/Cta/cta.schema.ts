import { z } from "zod";
import { linkSchema } from "../shared/link";

export const ctaSchema = z.object({
  title: z.string().min(1).meta({ label: "Заголовок" }),
  subtitle: z.string().meta({ label: "Подзаголовок", multiline: true }),
  ctaLabel: z.string().min(1).meta({ label: "Текст кнопки" }),
  ctaHref: linkSchema().meta({ label: "Ссылка кнопки" }),
});

export type CtaProps = z.infer<typeof ctaSchema>;
