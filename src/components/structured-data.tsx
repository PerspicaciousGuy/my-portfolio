import { site, socials, skills, alsoUsed } from "@/data/site";

/**
 * schema.org markup for the whole site, as one JSON-LD graph: a WebSite and
 * the Person it is about, linked by @id. Google reads Person markup to tie a
 * name to its profiles; it does not need to be exhaustive, so the facts here
 * are only the ones the page already states.
 */
export function StructuredData() {
  const personId = `${site.url}/#person`;
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: `${site.name} — Portfolio`,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        url: site.url,
        email: `mailto:${site.email}`,
        jobTitle: site.role,
        description: site.tagline,
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressRegion: "Rajasthan",
          addressLocality: "Ganganagar",
        },
        sameAs: socials.filter((s) => s.label === "LinkedIn" || s.label === "GitHub" || s.label === "X").map((s) => s.href),
        knowsAbout: [...skills.flatMap((g) => g.items), ...alsoUsed],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Serialised server-side from static data — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}
