import {
  and,
  call,
  component,
  contentConst,
  el,
  map,
  method,
  num,
  plus,
  ref,
  str,
} from "@/codegen/jsx";
import type { BlockCodegen } from "../defineBlock";
import type { FeaturesProps } from "./features.schema";

/** Зеркало Features.tsx: меняешь разметку там — меняй и здесь */
const featuresCodegen: BlockCodegen<FeaturesProps> = (props, variant, name) => {
  const subtitle = () =>
    and(ref("subtitle"), el("p", { className: "mt-4 text-[var(--color-muted)]" }, ref("subtitle")));

  const body =
    variant === "list"
      ? el(
          "section",
          { className: "bg-[var(--color-bg)] py-20 text-[var(--color-text)]" },
          el(
            "Container",
            { className: "grid gap-12 lg:grid-cols-[1fr_2fr]" },
            el(
              "div",
              {},
              el("h2", { className: "text-3xl font-semibold sm:text-4xl" }, ref("title")),
              subtitle(),
            ),
            el(
              "ul",
              {
                className:
                  "divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]",
              },
              map(
                "items",
                ["item", "index"],
                el(
                  "li",
                  { className: "flex gap-5 py-6" },
                  el(
                    "span",
                    { className: "font-medium text-[var(--color-primary)]" },
                    method(
                      call(ref("String"), plus(ref("index"), num(1))),
                      "padStart",
                      num(2),
                      str("0"),
                    ),
                  ),
                  el(
                    "div",
                    {},
                    el("h3", { className: "text-lg font-medium" }, ref("item.title")),
                    el(
                      "p",
                      { className: "mt-1 text-[var(--color-muted)]" },
                      ref("item.description"),
                    ),
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
            el(
              "div",
              { className: "mx-auto mb-12 max-w-2xl text-center" },
              el("h2", { className: "text-3xl font-semibold sm:text-4xl" }, ref("title")),
              subtitle(),
            ),
            el(
              "div",
              { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" },
              map(
                "items",
                ["item", "index"],
                el(
                  "div",
                  {
                    className:
                      "rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
                  },
                  el(
                    "span",
                    {
                      className:
                        "mb-4 flex size-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-medium text-[var(--color-bg)]",
                    },
                    plus(ref("index"), num(1)),
                  ),
                  el("h3", { className: "mb-2 text-lg font-medium" }, ref("item.title")),
                  el("p", { className: "text-[var(--color-muted)]" }, ref("item.description")),
                ),
              ),
            ),
          ),
        );

  return [contentConst(props), component(name, body, Object.keys(props))];
};

export default featuresCodegen;
