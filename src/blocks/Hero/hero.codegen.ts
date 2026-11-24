import { and, component, contentConst, el, ref } from "@/codegen/jsx";
import type { BlockCodegen } from "../defineBlock";
import type { HeroProps } from "./hero.schema";

/** Зеркало Hero.tsx: меняешь разметку там — меняй и здесь */
const heroCodegen: BlockCodegen<HeroProps> = (props, variant, name) => {
  const actions = () =>
    el(
      "div",
      { className: "flex flex-wrap gap-3" },
      el(
        "a",
        {
          href: ref("ctaHref"),
          className:
            "rounded-[var(--radius)] bg-[var(--color-primary)] px-6 py-3 font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]",
        },
        ref("ctaLabel"),
      ),
      and(
        ref("secondaryLabel"),
        el(
          "a",
          {
            href: ref("secondaryHref"),
            className:
              "rounded-[var(--radius)] border border-[var(--color-border)] px-6 py-3 font-medium transition-colors hover:bg-[var(--color-surface)]",
          },
          ref("secondaryLabel"),
        ),
      ),
    );

  const badge = () =>
    and(
      ref("eyebrow"),
      el(
        "span",
        {
          className:
            "rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-sm text-[var(--color-muted)]",
        },
        ref("eyebrow"),
      ),
    );

  const body =
    variant === "split"
      ? el(
          "section",
          { className: "bg-[var(--color-bg)] py-20 text-[var(--color-text)] sm:py-24" },
          el(
            "Container",
            { className: "grid items-center gap-12 lg:grid-cols-2" },
            el(
              "div",
              { className: "flex flex-col items-start gap-6" },
              badge(),
              el(
                "h1",
                { className: "text-4xl font-semibold tracking-tight sm:text-5xl" },
                ref("title"),
              ),
              el("p", { className: "text-lg text-[var(--color-muted)]" }, ref("subtitle")),
              actions(),
            ),
            el("div", {
              "aria-hidden": true,
              className:
                "aspect-[4/3] rounded-[var(--radius)] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/25 to-[var(--color-surface)]",
            }),
          ),
        )
      : el(
          "section",
          { className: "bg-[var(--color-bg)] py-24 text-[var(--color-text)] sm:py-32" },
          el(
            "Container",
            { className: "flex flex-col items-center gap-6 text-center" },
            badge(),
            el(
              "h1",
              { className: "max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl" },
              ref("title"),
            ),
            el("p", { className: "max-w-2xl text-lg text-[var(--color-muted)]" }, ref("subtitle")),
            el("div", { className: "flex justify-center" }, actions()),
          ),
        );

  return [contentConst(props), component(name, body, Object.keys(props))];
};

export default heroCodegen;
