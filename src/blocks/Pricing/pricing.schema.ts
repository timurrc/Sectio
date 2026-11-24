import { z } from "zod";

export const pricingSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
  plans: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.string().min(1),
        period: z.string(),
        description: z.string(),
        features: z.array(z.string()),
        ctaLabel: z.string().min(1),
        highlighted: z.boolean(),
      }),
    )
    .min(1)
    .max(4),
});

export type PricingProps = z.infer<typeof pricingSchema>;
