import { z } from "zod";

export const pricingSchema = z.object({
  title: z.string().min(1).meta({ label: "Заголовок" }),
  subtitle: z.string().meta({ label: "Подзаголовок", multiline: true }),
  plans: z
    .array(
      z.object({
        name: z.string().min(1).meta({ label: "Название" }),
        price: z.string().min(1).meta({ label: "Цена" }),
        period: z.string().meta({ label: "Период" }),
        description: z.string().meta({ label: "Описание" }),
        features: z
          .array(z.string().meta({ label: "Пункт" }))
          .meta({ label: "Что входит", itemLabel: "Пункт" }),
        ctaLabel: z.string().min(1).meta({ label: "Текст кнопки" }),
        highlighted: z.boolean().meta({ label: "Выделить тариф" }),
      }),
    )
    .min(1)
    .max(4)
    .meta({ label: "Тарифы", itemLabel: "Тариф" }),
});

export type PricingProps = z.infer<typeof pricingSchema>;
