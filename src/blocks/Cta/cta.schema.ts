import { z } from "zod";

export const ctaSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
  ctaLabel: z.string().min(1),
  ctaHref: z.string(),
});

export type CtaProps = z.infer<typeof ctaSchema>;
