import Container from "../shared/Container";
import type { LogosProps } from "./logos.schema";

interface LogosComponentProps {
  props: LogosProps;
  variant: string;
}

const Logos = ({ props, variant }: LogosComponentProps) => {
  const { title, logos } = props;

  if (variant === "grid") {
    return (
      <section className="bg-[var(--color-bg)] py-16 text-[var(--color-text)]">
        <Container>
          {title && <h2 className="mb-8 text-center text-2xl font-semibold">{title}</h2>}
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((logo, index) => (
              <li
                key={index}
                className="flex h-20 items-center justify-center rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-lg font-semibold text-[var(--color-muted)]"
              >
                {logo}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-bg)] py-12 text-[var(--color-text)]">
      <Container className="flex flex-col items-center gap-6">
        {title && <p className="text-center text-sm text-[var(--color-muted)]">{title}</p>}
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {logos.map((logo, index) => (
            <li
              key={index}
              className="text-xl font-semibold tracking-tight text-[var(--color-muted)]"
            >
              {logo}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default Logos;
