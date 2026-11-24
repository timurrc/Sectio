import Container from "../shared/Container";
import type { NavbarProps } from "./navbar.schema";

interface NavbarComponentProps {
  props: NavbarProps;
  variant: string;
}

const Navbar = ({ props, variant }: NavbarComponentProps) => {
  const { brand, links, ctaLabel, ctaHref } = props;

  if (variant === "centered") {
    return (
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-5 text-[var(--color-text)]">
        <Container className="flex flex-col items-center gap-3">
          <a href="#" className="text-xl font-semibold">
            {brand}
          </a>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-muted)]">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="transition-colors hover:text-[var(--color-text)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </Container>
      </header>
    );
  }

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-4 text-[var(--color-text)]">
      <Container className="flex items-center justify-between gap-6">
        <a href="#" className="text-lg font-semibold">
          {brand}
        </a>
        <nav className="hidden gap-6 text-sm text-[var(--color-muted)] md:flex">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="transition-colors hover:text-[var(--color-text)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        {ctaLabel && (
          <a
            href={ctaHref}
            className="rounded-[var(--radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            {ctaLabel}
          </a>
        )}
      </Container>
    </header>
  );
};

export default Navbar;
