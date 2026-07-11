import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-fg-subtle">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="font-mono text-xs text-fg-subtle">
          Built with Next.js, Three.js &amp; too much coffee
        </p>
      </div>
    </footer>
  );
}
