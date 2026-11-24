import { z } from "zod";

export const footerSchema = z.object({
  brand: z.string().min(1),
  tagline: z.string(),
  columns: z
    .array(
      z.object({
        title: z.string().min(1),
        links: z.array(z.object({ label: z.string().min(1), href: z.string() })),
      }),
    )
    .max(4),
  copyright: z.string(),
});

export type FooterProps = z.infer<typeof footerSchema>;
