import type { ReactNode } from "react";
import { Reveal } from "./reveal";

type Props = {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
};

/** A homepage section: pixel heading (square, index, title) and its content. */
export function Section({ id, index, title, children }: Props) {
  return (
    <section id={id} className="relative z-[1] pt-[120px]">
      <div className="px-wrap">
        <Reveal>
          <div className="px-heading">
            <span />
            <i>{index}</i>
            <h2>{title}</h2>
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
