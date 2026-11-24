import { z } from "zod";

export const logosSchema = z.object({
  title: z.string().meta({ label: "Заголовок" }),
  logos: z
    .array(z.string().min(1).meta({ label: "Название" }))
    .min(1)
    .max(12)
    .meta({ label: "Компании", itemLabel: "Компания" }),
});

export type LogosProps = z.infer<typeof logosSchema>;
