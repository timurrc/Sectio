import { and, component, contentConst, el, ref } from "@/codegen/jsx";
import type { BlockCodegen } from "../defineBlock";
import type { CtaProps } from "./cta.schema";

/** Зеркало Cta.tsx: меняешь разметку там — меняй и здесь */
const ctaCodegen: BlockCodegen<CtaProps> = (props, variant, name) => {
  const title = () => el("h2", { className: "text-3xl font-semibold sm:text-4xl" }, ref("title"));

  const body =
    variant === "simple"
      ? el(
          "section",
          {
            className:
              "border-y border-[var(--color-border)] bg-[var(--color-surface)] py-20 text-[var(--color-text)]",
          },
          el(
            "Container",
            { className: "flex flex-col items-center gap-4 text-center" },
            title(),
            and(
              ref("subtitle"),
              el("p", { className: "max-w-xl text-[var(--color-muted)]" }, ref("subtitle")),
            ),
            el(
              "a",
              {
                href: ref("ctaHref"),
                className:
                  "mt-2 rounded-[var(--radius)] bg-[var(--color-primary)] px-6 py-3 font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]",
              },
              ref("ctaLabel"),
            ),
          ),
        )
      : el(
          "section",
          { className: "bg-[var(--color-bg)] py-20 text-[var(--color-text)]" },
          el(
            "Container",
            {},
            el(
              "div",
              {
                className:
                  "flex flex-col items-center gap-4 rounded-[var(--radius)] bg-[var(--color-primary)] px-8 py-16 text-center text-[var(--color-bg)]",
              },
              title(),
              and(ref("subtitle"), el("p", { className: "max-w-xl opacity-80" }, ref("subtitle"))),
              el(
                "a",
                {
                  href: ref("ctaHref"),
                  className:
                    "mt-2 rounded-[var(--radius)] bg-[var(--color-bg)] px-6 py-3 font-medium text-[var(--color-primary)] transition-opacity hover:opacity-90",
                },
                ref("ctaLabel"),
              ),
            ),
          ),
        );

  return [contentConst(props), component(name, body, Object.keys(props))];
};

export default ctaCodegen;
