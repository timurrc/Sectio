import { and, component, contentConst, el, map, ref } from "@/codegen/jsx";
import type { BlockCodegen } from "../defineBlock";
import type { FaqProps } from "./faq.schema";

/** Зеркало Faq.tsx: меняешь разметку там — меняй и здесь */
const faqCodegen: BlockCodegen<FaqProps> = (props, variant, name) => {
  const title = () => el("h2", { className: "text-3xl font-semibold sm:text-4xl" }, ref("title"));
  const subtitle = () =>
    and(ref("subtitle"), el("p", { className: "mt-4 text-[var(--color-muted)]" }, ref("subtitle")));

  const body =
    variant === "columns"
      ? el(
          "section",
          { className: "bg-[var(--color-bg)] py-20 text-[var(--color-text)]" },
          el(
            "Container",
            {},
            el("div", { className: "mb-12 max-w-2xl" }, title(), subtitle()),
            el(
              "dl",
              { className: "grid gap-x-12 gap-y-10 md:grid-cols-2" },
              map(
                "items",
                ["item", "index"],
                el(
                  "div",
                  {},
                  el("dt", { className: "text-lg font-medium" }, ref("item.question")),
                  el("dd", { className: "mt-2 text-[var(--color-muted)]" }, ref("item.answer")),
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
            { className: "max-w-3xl" },
            el("div", { className: "mb-10 text-center" }, title(), subtitle()),
            el(
              "div",
              {
                className:
                  "divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]",
              },
              map(
                "items",
                ["item", "index"],
                el(
                  "details",
                  { className: "group py-5" },
                  el(
                    "summary",
                    {
                      className:
                        "flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium",
                    },
                    ref("item.question"),
                    el(
                      "span",
                      {
                        className:
                          "text-[var(--color-primary)] transition-transform group-open:rotate-45",
                      },
                      "+",
                    ),
                  ),
                  el("p", { className: "mt-3 text-[var(--color-muted)]" }, ref("item.answer")),
                ),
              ),
            ),
          ),
        );

  return [contentConst(props), component(name, body, Object.keys(props))];
};

export default faqCodegen;
