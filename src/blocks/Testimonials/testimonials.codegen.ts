import { and, component, contentConst, el, map, method, num, ref } from "@/codegen/jsx";
import type { BlockCodegen } from "../defineBlock";
import type { TestimonialsProps } from "./testimonials.schema";

/** Зеркало Testimonials.tsx: меняешь разметку там — меняй и здесь */
const testimonialsCodegen: BlockCodegen<TestimonialsProps> = (props, variant, name) => {
  const heading = el(
    "div",
    { className: "mx-auto mb-12 max-w-2xl text-center" },
    el("h2", { className: "text-3xl font-semibold sm:text-4xl" }, ref("title")),
    and(ref("subtitle"), el("p", { className: "mt-4 text-[var(--color-muted)]" }, ref("subtitle"))),
  );

  const body =
    variant === "large"
      ? el(
          "section",
          { className: "bg-[var(--color-bg)] py-20 text-[var(--color-text)]" },
          el(
            "Container",
            { className: "max-w-3xl" },
            heading,
            el(
              "div",
              { className: "flex flex-col gap-12" },
              map(
                "items",
                ["item", "index"],
                el(
                  "figure",
                  { className: "text-center" },
                  el(
                    "blockquote",
                    { className: "text-2xl font-medium sm:text-3xl" },
                    "«",
                    ref("item.quote"),
                    "»",
                  ),
                  el(
                    "figcaption",
                    { className: "mt-6 text-[var(--color-muted)]" },
                    el(
                      "span",
                      { className: "font-medium text-[var(--color-text)]" },
                      ref("item.author"),
                    ),
                    and(ref("item.role"), el("span", {}, " · ", ref("item.role"))),
                  ),
                ),
              ),
            ),
          ),
        )
      : el(
          "section",
          { className: "bg-[var(--color-bg)] py-20 text-[var(--color-text)]" },
          el(
            "Container",
            {},
            heading,
            el(
              "div",
              { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" },
              map(
                "items",
                ["item", "index"],
                el(
                  "figure",
                  {
                    className:
                      "flex flex-col justify-between gap-6 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
                  },
                  el("blockquote", {}, "«", ref("item.quote"), "»"),
                  el(
                    "figcaption",
                    { className: "flex items-center gap-3" },
                    el(
                      "span",
                      {
                        className:
                          "flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] font-medium text-[var(--color-bg)]",
                      },
                      method(ref("item.author"), "charAt", num(0)),
                    ),
                    el(
                      "span",
                      {},
                      el("span", { className: "block font-medium" }, ref("item.author")),
                      el(
                        "span",
                        { className: "block text-sm text-[var(--color-muted)]" },
                        ref("item.role"),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );

  return [contentConst(props), component(name, body, Object.keys(props))];
};

export default testimonialsCodegen;
