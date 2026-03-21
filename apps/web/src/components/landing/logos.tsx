import { Trans } from "@lingui/react/macro";

const companies = ["Acme Corp", "Globex", "Initech", "Stark Industries", "Wayne Enterprises"];

export const Logos = () => (
  <section className="border-[var(--line)] border-t px-4 py-12 sm:py-16">
    <div className="page-wrap">
      <p className="island-kicker mb-8 text-center">
        <Trans>Trusted by teams worldwide</Trans>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {companies.map((name) => (
          <span key={name} className="text-base font-bold tracking-wider text-[var(--sea-ink)] opacity-40 sm:text-lg">
            {name}
          </span>
        ))}
      </div>
    </div>
  </section>
);
