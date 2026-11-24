import Container from "../shared/Container";
import type { HeroProps } from "./hero.schema";

interface HeroComponentProps {
  props: HeroProps;
  variant: string;
}

const Hero = ({ props, variant }: HeroComponentProps) => {
  const { eyebrow, title, subtitle, ctaLabel, ctaHref, secondaryLabel, secondaryHref } = props;

  const actions = (
    <div className="flex flex-wrap gap-3">
      <a
        href={ctaHref}
        className="rounded-[var(--radius)] bg-[var(--color-primary)] px-6 py-3 font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        {ctaLabel}
      </a>
      {secondaryLabel && (
        <a
          href={secondaryHref}
          className="rounded-[var(--radius)] border border-[var(--color-border)] px-6 py-3 font-medium transition-colors hover:bg-[var(--color-surface)]"
        >
          {secondaryLabel}
        </a>
      )}
    </div>
  );

  const badge = eyebrow && (
    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-sm text-[var(--color-muted)]">
      {eyebrow}
    </span>
  );

  if (variant === "split") {
    return (
      <section className="bg-[var(--color-bg)] py-20 text-[var(--color-text)] sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            {badge}
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="text-lg text-[var(--color-muted)]">{subtitle}</p>
            {actions}
          </div>
          <div
            aria-hidden
            className="aspect-[4/3] rounded-[var(--radius)] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/25 to-[var(--color-surface)]"
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg)] py-24 text-[var(--color-text)] sm:py-32">
      <Container className="flex flex-col items-center gap-6 text-center">
        {badge}
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
        <p className="max-w-2xl text-lg text-[var(--color-muted)]">{subtitle}</p>
        <div className="flex justify-center">{actions}</div>
      </Container>
    </section>
  );
};

export default Hero;
