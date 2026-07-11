import type { ReactNode } from "react";
import { Reveal } from "./reveal";

type Props = {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, index, title, children }: Props) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-5xl px-6 py-28 sm:py-36">
      <Reveal>
        <div className="mb-14 flex items-baseline gap-4">
          <span className="font-mono text-sm text-accent">{index}</span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <span className="h-px flex-1 bg-border" />
        </div>
      </Reveal>
      {children}
    </section>
  );
}
