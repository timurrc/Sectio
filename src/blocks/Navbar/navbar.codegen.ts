import { and, component, contentConst, el, map, ref } from "@/codegen/jsx";
import type { BlockCodegen } from "../defineBlock";
import type { NavbarProps } from "./navbar.schema";

/** Зеркало Navbar.tsx: меняешь разметку там — меняй и здесь */
const navbarCodegen: BlockCodegen<NavbarProps> = (props, variant, name) => {
  const links = () =>
    map(
      "links",
      ["link", "index"],
      el(
        "a",
        { href: ref("link.href"), className: "transition-colors hover:text-[var(--color-text)]" },
        ref("link.label"),
      ),
    );

  const body =
    variant === "centered"
      ? el(
          "header",
          {
            className:
              "border-b border-[var(--color-border)] bg-[var(--color-bg)] py-5 text-[var(--color-text)]",
          },
          el(
            "Container",
            { className: "flex flex-col items-center gap-3" },
            el("a", { href: "#", className: "text-xl font-semibold" }, ref("brand")),
            el(
              "nav",
              {
                className:
                  "flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-muted)]",
              },
              links(),
            ),
          ),
        )
      : el(
          "header",
          {
            className:
              "border-b border-[var(--color-border)] bg-[var(--color-bg)] py-4 text-[var(--color-text)]",
          },
          el(
            "Container",
            { className: "flex items-center justify-between gap-6" },
            el("a", { href: "#", className: "text-lg font-semibold" }, ref("brand")),
            el(
              "nav",
              { className: "hidden gap-6 text-sm text-[var(--color-muted)] md:flex" },
              links(),
            ),
            and(
              ref("ctaLabel"),
              el(
                "a",
                {
                  href: ref("ctaHref"),
                  className:
                    "rounded-[var(--radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]",
                },
                ref("ctaLabel"),
              ),
            ),
          ),
        );

  // В центрированном варианте кнопки нет — не тащим её данные в файл
  const content = variant === "centered" ? { brand: props.brand, links: props.links } : props;

  return [contentConst(content), component(name, body, Object.keys(content))];
};

export default navbarCodegen;
