import { Trans, useLingui } from "@lingui/react/macro";

export const Testimonials = () => {
  const { t } = useLingui();

  const avatarColors = ["bg-[var(--lagoon)]", "bg-[var(--palm)]", "bg-[var(--lagoon-deep)]"];

  const testimonials = [
    {
      quote: t`This starter saved us weeks of setup time. Everything just works out of the box.`,
      name: "Alex Chen",
      role: t`CTO at TechCo`,
    },
    {
      quote: t`The best developer experience I've had. Type-safe from database to frontend.`,
      name: "Sarah Kim",
      role: t`Senior Engineer`,
    },
    {
      quote: t`Finally, a template that doesn't compromise on quality. Production-ready from day one.`,
      name: "Marcus Rivera",
      role: t`Founder at LaunchPad`,
    },
  ];

  return (
    <section className="border-[var(--line)] border-t px-4 py-16 sm:py-24">
      <div className="page-wrap">
        <div className="mb-12 text-center">
          <p className="island-kicker mb-3">
            <Trans>Testimonials</Trans>
          </p>
          <h2 className="display-title mx-auto max-w-2xl font-bold text-3xl text-[var(--sea-ink)] tracking-tight sm:text-4xl">
            <Trans>Loved by developers</Trans>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.map(({ quote, name, role }, index) => (
            <article key={name} className="island-shell rounded-2xl p-6">
              <span className="display-title mb-2 block text-3xl text-[var(--lagoon)] leading-none opacity-50">
                &ldquo;
              </span>
              <blockquote className="mb-6 text-[var(--sea-ink)] leading-relaxed">{quote}</blockquote>
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full font-bold text-sm text-white ${avatarColors[index]}`}
                >
                  {name[0]}
                </div>
                <div>
                  <p className="m-0 font-semibold text-sm text-[var(--sea-ink)]">{name}</p>
                  <p className="m-0 text-xs text-[var(--sea-ink-soft)]">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
