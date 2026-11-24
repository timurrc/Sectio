import Container from "../shared/Container";
import type { FaqProps } from "./faq.schema";

interface FaqComponentProps {
  props: FaqProps;
  variant: string;
}

const Faq = ({ props, variant }: FaqComponentProps) => {
  const { title, subtitle, items } = props;

  if (variant === "columns") {
    return (
      <section className="bg-[var(--color-bg)] py-20 text-[var(--color-text)]">
        <Container>
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-4 text-[var(--color-muted)]">{subtitle}</p>}
          </div>
          <dl className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {items.map((item, index) => (
              <div key={index}>
                <dt className="text-lg font-medium">{item.question}</dt>
                <dd className="mt-2 text-[var(--color-muted)]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg)] py-20 text-[var(--color-text)]">
      <Container className="max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-[var(--color-muted)]">{subtitle}</p>}
        </div>
        <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {items.map((item, index) => (
            <details key={index} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                {item.question}
                <span className="text-[var(--color-primary)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[var(--color-muted)]">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Faq;
