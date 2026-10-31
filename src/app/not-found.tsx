import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { NotFoundGame } from "@/components/pixel/not-found-game";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <main className="px-wrap relative z-[1] flex-1 pb-10 pt-14 text-center">
        <h1 className="m-0 font-display text-[clamp(96px,16vw,168px)] font-bold leading-none text-accent [text-shadow:8px_8px_0_rgb(var(--shade))]">
          404
        </h1>
        <p className="m-0 mt-2 font-display text-[28px] font-semibold uppercase tracking-wide">This page ran off the map</p>
        <p className="mb-0 mt-2 text-[26px] text-fg-muted">The critter is looking for it too. Help it dodge the cones while you wait.</p>
        <p className="mb-10 mt-6">
          <Link href="/" className="px-btn px-btn-primary">
            Back to the homepage
          </Link>
          <Link href="/#work" className="px-btn px-btn-ghost">
            See my work
          </Link>
        </p>
        <NotFoundGame />
      </main>
      <Footer />
    </>
  );
}
