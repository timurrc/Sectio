import { and, component, contentConst, cx, el, map, ref } from "@/codegen/jsx";
import type { BlockCodegen } from "../defineBlock";
import type { PricingProps } from "./pricing.schema";

/** Зеркало Pricing.tsx: меняешь разметку там — меняй и здесь */
const pricingCodegen: BlockCodegen<PricingProps> = (props, variant, name) => {
  const heading = el(
    "div",
    { className: "mx-auto mb-12 max-w-2xl text-center" },
    el("h2", { className: "text-3xl font-semibold sm:text-4xl" }, ref("title")),
    and(ref("subtitle"), el("p", { className: "mt-4 text-[var(--color-muted)]" }, ref("subtitle"))),
  );

  const plans =
    variant === "table"
      ? el(
          "div",
          {
            className:
              "divide-y divide-[var(--color-border)] overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)]",
          },
          map(
            "plans",
            ["plan", "index"],
            el(
              "div",
              {
                className: cx(
                  "grid items-center gap-4 p-6 md:grid-cols-[1fr_2fr_auto]",
                  ref("plan.highlighted"),
                  "bg-[var(--color-surface)]",
                  "",
                ),
              },
              el(
                "div",
                {},
                el("h3", { className: "text-lg font-medium" }, ref("plan.name")),
                el(
                  "p",
                  { className: "text-sm text-[var(--color-muted)]" },
                  ref("plan.description"),
                ),
              ),
              el(
                "ul",
                { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-muted)]" },
                map(
                  "plan.features",
                  ["feature", "featureIndex"],
                  el("li", {}, "✓ ", ref("feature")),
                ),
              ),
              el(
                "div",
                { className: "flex items-center gap-4" },
                el(
                  "div",
                  {},
                  el("span", { className: "text-2xl font-semibold" }, ref("plan.price")),
                  el("span", { className: "text-[var(--color-muted)]" }, ref("plan.period")),
                ),
                el(
                  "a",
                  {
                    href: "#",
                    className:
                      "rounded-[var(--radius)] bg-[var(--color-primary)] px-5 py-2.5 font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]",
                  },
                  ref("plan.ctaLabel"),
                ),
              ),
            ),
          ),
        )
      : el(
          "div",
          { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" },
          map(
            "plans",
            ["plan", "index"],
            el(
              "div",
              {
                className: cx(
                  "flex flex-col rounded-[var(--radius)] border bg-[var(--color-surface)] p-8",
                  ref("plan.highlighted"),
                  "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]",
                  "border-[var(--color-border)]",
                ),
              },
              el("h3", { className: "text-lg font-medium" }, ref("plan.name")),
              el(
                "p",
                { className: "mt-1 text-sm text-[var(--color-muted)]" },
                ref("plan.description"),
              ),
              el(
                "p",
                { className: "mt-6" },
                el("span", { className: "text-4xl font-semibold" }, ref("plan.price")),
                el("span", { className: "text-[var(--color-muted)]" }, ref("plan.period")),
              ),
              el(
                "ul",
                { className: "mt-6 flex flex-1 flex-col gap-2 text-sm" },
                map(
                  "plan.features",
                  ["feature", "featureIndex"],
                  el(
                    "li",
                    { className: "flex gap-2" },
                    el("span", { className: "text-[var(--color-primary)]" }, "✓"),
                    ref("feature"),
                  ),
                ),
              ),
              el(
                "a",
                {
                  href: "#",
                  className:
                    "mt-8 rounded-[var(--radius)] bg-[var(--color-primary)] px-5 py-3 text-center font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]",
                },
                ref("plan.ctaLabel"),
              ),
            ),
          ),
        );

  const body = el(
    "section",
    { className: "bg-[var(--color-bg)] py-20 text-[var(--color-text)]" },
    el("Container", {}, heading, plans),
  );

  return [contentConst(props), component(name, body, Object.keys(props))];
};

export default pricingCodegen;
