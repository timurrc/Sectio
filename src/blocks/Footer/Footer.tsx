import Container from "../shared/Container";
import type { FooterProps } from "./footer.schema";

interface FooterComponentProps {
  props: FooterProps;
  variant: string;
}

const Footer = ({ props, variant }: FooterComponentProps) => {
  const { brand, tagline, columns, copyright } = props;

  if (variant === "minimal") {
    return (
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-8 text-[var(--color-text)]">
        <Container className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <span className="font-semibold">{brand}</span>
          <span className="text-sm text-[var(--color-muted)]">{copyright}</span>
        </Container>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12 text-[var(--color-text)]">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <span className="text-lg font-semibold">{brand}</span>
            {tagline && <p className="mt-2 text-sm text-[var(--color-muted)]">{tagline}</p>}
          </div>
          <div className="flex flex-wrap gap-12">
            {columns.map((column, index) => (
              <div key={index}>
                <h3 className="mb-3 text-sm font-medium">{column.title}</h3>
                <ul className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="transition-colors hover:text-[var(--color-text)]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-muted)]">
          {copyright}
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
