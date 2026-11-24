import Container from "../shared/Container";
import type { TestimonialsProps } from "./testimonials.schema";

interface TestimonialsComponentProps {
  props: TestimonialsProps;
  variant: string;
}

const Testimonials = ({ props, variant }: TestimonialsComponentProps) => {
  const { title, subtitle, items } = props;

  const heading = (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-[var(--color-muted)]">{subtitle}</p>}
    </div>
  );

  if (variant === "large") {
    return (
      <section className="bg-[var(--color-bg)] py-20 text-[var(--color-text)]">
        <Container className="max-w-3xl">
          {heading}
          <div className="flex flex-col gap-12">
            {items.map((item, index) => (
              <figure key={index} className="text-center">
                <blockquote className="text-2xl font-medium sm:text-3xl">«{item.quote}»</blockquote>
                <figcaption className="mt-6 text-[var(--color-muted)]">
                  <span className="font-medium text-[var(--color-text)]">{item.author}</span>
                  {item.role && <span> · {item.role}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg)] py-20 text-[var(--color-text)]">
      <Container>
        {heading}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <figure
              key={index}
              className="flex flex-col justify-between gap-6 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <blockquote>«{item.quote}»</blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] font-medium text-[var(--color-bg)]">
                  {item.author.charAt(0)}
                </span>
                <span>
                  <span className="block font-medium">{item.author}</span>
                  <span className="block text-sm text-[var(--color-muted)]">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
