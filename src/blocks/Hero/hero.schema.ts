import { z } from "zod";

export const heroSchema = z.object({
  eyebrow: z.string(),
  title: z.string().min(1),
  subtitle: z.string(),
  ctaLabel: z.string().min(1),
  ctaHref: z.string(),
  secondaryLabel: z.string(),
  secondaryHref: z.string(),
});

export type HeroProps = z.infer<typeof heroSchema>;
