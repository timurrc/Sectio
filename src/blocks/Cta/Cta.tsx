import Container from "../shared/Container";
import type { CtaProps } from "./cta.schema";

interface CtaComponentProps {
  props: CtaProps;
  variant: string;
}

const Cta = ({ props, variant }: CtaComponentProps) => {
  const { title, subtitle, ctaLabel, ctaHref } = props;

  if (variant === "simple") {
    return (
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-20 text-[var(--color-text)]">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          {subtitle && <p className="max-w-xl text-[var(--color-muted)]">{subtitle}</p>}
          <a
            href={ctaHref}
            className="mt-2 rounded-[var(--radius)] bg-[var(--color-primary)] px-6 py-3 font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            {ctaLabel}
          </a>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg)] py-20 text-[var(--color-text)]">
      <Container>
        <div className="flex flex-col items-center gap-4 rounded-[var(--radius)] bg-[var(--color-primary)] px-8 py-16 text-center text-[var(--color-bg)]">
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          {subtitle && <p className="max-w-xl opacity-80">{subtitle}</p>}
          <a
            href={ctaHref}
            className="mt-2 rounded-[var(--radius)] bg-[var(--color-bg)] px-6 py-3 font-medium text-[var(--color-primary)] transition-opacity hover:opacity-90"
          >
            {ctaLabel}
          </a>
        </div>
      </Container>
    </section>
  );
};

export default Cta;
