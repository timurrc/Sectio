import Container from "../shared/Container";
import type { FeaturesProps } from "./features.schema";

interface FeaturesComponentProps {
  props: FeaturesProps;
  variant: string;
}

const Features = ({ props, variant }: FeaturesComponentProps) => {
  const { title, subtitle, items } = props;

  if (variant === "list") {
    return (
      <section className="bg-[var(--color-bg)] py-20 text-[var(--color-text)]">
        <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-4 text-[var(--color-muted)]">{subtitle}</p>}
          </div>
          <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {items.map((item, index) => (
              <li key={index} className="flex gap-5 py-6">
                <span className="font-medium text-[var(--color-primary)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-1 text-[var(--color-muted)]">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg)] py-20 text-[var(--color-text)]">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-[var(--color-muted)]">{subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-medium text-[var(--color-bg)]">
                {index + 1}
              </span>
              <h3 className="mb-2 text-lg font-medium">{item.title}</h3>
              <p className="text-[var(--color-muted)]">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
