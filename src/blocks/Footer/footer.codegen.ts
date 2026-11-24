import { and, component, contentConst, el, map, ref } from "@/codegen/jsx";
import type { BlockCodegen } from "../defineBlock";
import type { FooterProps } from "./footer.schema";

/** Зеркало Footer.tsx: меняешь разметку там — меняй и здесь */
const footerCodegen: BlockCodegen<FooterProps> = (props, variant, name) => {
  const body =
    variant === "minimal"
      ? el(
          "footer",
          {
            className:
              "border-t border-[var(--color-border)] bg-[var(--color-bg)] py-8 text-[var(--color-text)]",
          },
          el(
            "Container",
            { className: "flex flex-col items-center justify-between gap-2 sm:flex-row" },
            el("span", { className: "font-semibold" }, ref("brand")),
            el("span", { className: "text-sm text-[var(--color-muted)]" }, ref("copyright")),
          ),
        )
      : el(
          "footer",
          {
            className:
              "border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12 text-[var(--color-text)]",
          },
          el(
            "Container",
            {},
            el(
              "div",
              { className: "flex flex-col gap-10 md:flex-row md:justify-between" },
              el(
                "div",
                { className: "max-w-xs" },
                el("span", { className: "text-lg font-semibold" }, ref("brand")),
                and(
                  ref("tagline"),
                  el("p", { className: "mt-2 text-sm text-[var(--color-muted)]" }, ref("tagline")),
                ),
              ),
              el(
                "div",
                { className: "flex flex-wrap gap-12" },
                map(
                  "columns",
                  ["column", "index"],
                  el(
                    "div",
                    {},
                    el("h3", { className: "mb-3 text-sm font-medium" }, ref("column.title")),
                    el(
                      "ul",
                      { className: "flex flex-col gap-2 text-sm text-[var(--color-muted)]" },
                      map(
                        "column.links",
                        ["link", "linkIndex"],
                        el(
                          "li",
                          {},
                          el(
                            "a",
                            {
                              href: ref("link.href"),
                              className: "transition-colors hover:text-[var(--color-text)]",
                            },
                            ref("link.label"),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            el(
              "p",
              {
                className:
                  "mt-10 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-muted)]",
              },
              ref("copyright"),
            ),
          ),
        );

  // В минимальном варианте tagline и columns не нужны — не тащим их в данные файла
  const content =
    variant === "minimal" ? { brand: props.brand, copyright: props.copyright } : props;

  return [contentConst(content), component(name, body, Object.keys(content))];
};

export default footerCodegen;
