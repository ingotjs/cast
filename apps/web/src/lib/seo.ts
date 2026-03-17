/** Returns meta tags for title + description across OG, Twitter, and standard meta. */
export const seoMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => [
  { title },
  { name: "description", content: description },
  { property: "og:title", content: title },
  { property: "og:description", content: description },
  { name: "twitter:title", content: title },
  { name: "twitter:description", content: description },
];
