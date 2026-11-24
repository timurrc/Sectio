import { and, component, contentConst, el, map, ref } from "@/codegen/jsx";
import type { BlockCodegen } from "../defineBlock";
import type { LogosProps } from "./logos.schema";

/** Зеркало Logos.tsx: меняешь разметку там — меняй и здесь */
const logosCodegen: BlockCodegen<LogosProps> = (props, variant, name) => {
  const body =
    variant === "grid"
      ? el(
          "section",
          { className: "bg-[var(--color-bg)] py-16 text-[var(--color-text)]" },
          el(
            "Container",
            {},
            and(
              ref("title"),
              el("h2", { className: "mb-8 text-center text-2xl font-semibold" }, ref("title")),
            ),
            el(
              "ul",
              { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" },
              map(
                "logos",
                ["logo", "index"],
                el(
                  "li",
                  {
                    className:
                      "flex h-20 items-center justify-center rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-lg font-semibold text-[var(--color-muted)]",
                  },
                  ref("logo"),
                ),
              ),
            ),
          ),
        )
      : el(
          "section",
          {
            className:
              "border-y border-[var(--color-border)] bg-[var(--color-bg)] py-12 text-[var(--color-text)]",
          },
          el(
            "Container",
            { className: "flex flex-col items-center gap-6" },
            and(
              ref("title"),
              el("p", { className: "text-center text-sm text-[var(--color-muted)]" }, ref("title")),
            ),
            el(
              "ul",
              { className: "flex flex-wrap items-center justify-center gap-x-12 gap-y-4" },
              map(
                "logos",
                ["logo", "index"],
                el(
                  "li",
                  { className: "text-xl font-semibold tracking-tight text-[var(--color-muted)]" },
                  ref("logo"),
                ),
              ),
            ),
          ),
        );

  return [contentConst(props), component(name, body, Object.keys(props))];
};

export default logosCodegen;
