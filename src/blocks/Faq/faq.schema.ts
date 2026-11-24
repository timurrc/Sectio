import { z } from "zod";

export const faqSchema = z.object({
  title: z.string().min(1).meta({ label: "Заголовок" }),
  subtitle: z.string().meta({ label: "Подзаголовок", multiline: true }),
  items: z
    .array(
      z.object({
        question: z.string().min(1).meta({ label: "Вопрос" }),
        answer: z.string().min(1).meta({ label: "Ответ", multiline: true }),
      }),
    )
    .min(1)
    .max(12)
    .meta({ label: "Вопросы", itemLabel: "Вопрос" }),
});

export type FaqProps = z.infer<typeof faqSchema>;
