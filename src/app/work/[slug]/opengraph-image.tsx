import { notFound } from "next/navigation";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";
import { shareCard, SHARE_SIZE } from "@/lib/share-card";

export const size = SHARE_SIZE;
export const contentType = "image/png";
export const alt = "Case study by Harshit Bishnoi";

export async function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();
  return shareCard({
    kind: "project",
    eyebrow: `Case study · ${study.project.year}`,
    title: study.project.name,
    art: study.project.art,
  });
}
