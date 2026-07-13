import { site, socials, skills } from "@/data/site";

/**
 * schema.org Person markup. This is what lets Google show a knowledge panel
 * and understand the site describes a person with a role, rather than
 * guessing from the copy.
 */
export function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "Rajasthan",
      addressLocality: "Ganganagar",
    },
    sameAs: socials
      .filter((s) => s.label !== "Email")
      .map((s) => s.href),
    knowsAbout: skills.flatMap((g) => g.items),
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Bachelor of Computer Applications (BCA)",
    },
    seeks: {
      "@type": "Demand",
      name: "Full-stack developer roles",
    },
  };

  return (
    <script
      type="application/ld+json"
      // Serialised server-side from static data — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
