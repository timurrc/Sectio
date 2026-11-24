import { z } from "zod";

export const featuresSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
  items: z
    .array(z.object({ title: z.string().min(1), description: z.string() }))
    .min(1)
    .max(9),
});

export type FeaturesProps = z.infer<typeof featuresSchema>;
