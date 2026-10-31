import type { ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Critter } from "./critter";
import { Figure } from "./figure";
import { Console } from "./console";

/** A pulled-out line as a speech bubble with the critter next to it: how a markdown quote renders. */
function Talk({ children }: { children?: ReactNode }) {
  return (
    <blockquote className="px-talk">
      <div className="relative h-[68px] w-[104px] flex-none">
        <div className="absolute bottom-0 left-0">
          <Critter u={4} face="happy" />
        </div>
      </div>
      <div className="px-talk-box">{children}</div>
    </blockquote>
  );
}

const components = { blockquote: Talk, Figure, Playground: Console };

/** MDX body styled by `.px-prose` in globals.css. */
export function Prose({ source }: { source: string }) {
  if (!source) return null;
  return (
    <div className="px-prose">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
