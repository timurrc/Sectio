import Container from "../shared/Container";
import type { PricingProps } from "./pricing.schema";

interface PricingComponentProps {
  props: PricingProps;
  variant: string;
}

const Pricing = ({ props, variant }: PricingComponentProps) => {
  const { title, subtitle, plans } = props;

  const heading = (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-[var(--color-muted)]">{subtitle}</p>}
    </div>
  );

  if (variant === "table") {
    return (
      <section className="bg-[var(--color-bg)] py-20 text-[var(--color-text)]">
        <Container>
          {heading}
          <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)]">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`grid items-center gap-4 p-6 md:grid-cols-[1fr_2fr_auto] ${
                  plan.highlighted ? "bg-[var(--color-surface)]" : ""
                }`}
              >
                <div>
                  <h3 className="text-lg font-medium">{plan.name}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{plan.description}</p>
                </div>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-muted)]">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>✓ {feature}</li>
                  ))}
                </ul>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-2xl font-semibold">{plan.price}</span>
                    <span className="text-[var(--color-muted)]">{plan.period}</span>
                  </div>
                  <a
                    href="#"
                    className="rounded-[var(--radius)] bg-[var(--color-primary)] px-5 py-2.5 font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]"
                  >
                    {plan.ctaLabel}
                  </a>
                </div>
              </div>
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
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-[var(--radius)] border bg-[var(--color-surface)] p-8 ${
                plan.highlighted
                  ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                  : "border-[var(--color-border)]"
              }`}
            >
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{plan.description}</p>
              <p className="mt-6">
                <span className="text-4xl font-semibold">{plan.price}</span>
                <span className="text-[var(--color-muted)]">{plan.period}</span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex gap-2">
                    <span className="text-[var(--color-primary)]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-8 rounded-[var(--radius)] bg-[var(--color-primary)] px-5 py-3 text-center font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                {plan.ctaLabel}
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Pricing;
