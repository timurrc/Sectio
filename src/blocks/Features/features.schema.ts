import { z } from "zod";

export const featuresSchema = z.object({
  title: z.string().min(1).meta({ label: "Заголовок" }),
  subtitle: z.string().meta({ label: "Подзаголовок", multiline: true }),
  items: z
    .array(
      z.object({
        title: z.string().min(1).meta({ label: "Название" }),
        description: z.string().meta({ label: "Описание", multiline: true }),
      }),
    )
    .min(1)
    .max(9)
    .meta({ label: "Преимущества", itemLabel: "Преимущество" }),
});

export type FeaturesProps = z.infer<typeof featuresSchema>;
