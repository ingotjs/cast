import { createFileRoute } from "@tanstack/react-router";

import { seoMeta } from "../lib/seo";
import * as m from "../paraglide/messages";

const getFaqs = () => [
  { question: m.faq_q_what_is(), answer: m.faq_a_what_is() },
  { question: m.faq_q_tech_stack(), answer: m.faq_a_tech_stack() },
  { question: m.faq_q_get_started(), answer: m.faq_a_get_started() },
  { question: m.faq_q_auth(), answer: m.faq_a_auth() },
  { question: m.faq_q_open_source(), answer: m.faq_a_open_source() },
  { question: m.faq_q_deploy(), answer: m.faq_a_deploy() },
];

const FAQPage = () => {
  const faqs = getFaqs();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight">{m.faq_heading()}</h1>
      <p className="mt-2 text-muted-foreground">{m.faq_subheading()}</p>

      <div className="mt-8 space-y-8">
        {faqs.map((faq) => (
          <section key={faq.question}>
            <h2 className="text-lg font-semibold">{faq.question}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
};

export const Route = createFileRoute("/faq")({
  head: () => {
    const faqs = getFaqs();
    return {
      meta: [
        ...seoMeta({
          title: m.meta_faq_title(),
          description: m.meta_faq_description(),
        }),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        },
      ],
    };
  },
  component: FAQPage,
});
