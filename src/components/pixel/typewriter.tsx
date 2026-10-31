"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/pixel-events";

/**
 * Types a role, holds it, deletes it, then moves on to the next. The first
 * role is server-rendered in full so the text is there before hydration and
 * for anyone with reduced motion; the typing starts on the client.
 */
export function Typewriter({ roles }: { roles: readonly string[] }) {
  const [text, setText] = useState(roles[0]);
  const [caret, setCaret] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let i = 0;
    let n = roles[0].length;
    let dir = -1;
    let hold = 28;
    let k = 0;
    const timer = window.setInterval(() => {
      if (hold > 0) hold--;
      else if (dir === 1) {
        if (n < roles[i].length) n++;
        else {
          dir = -1;
          hold = 24;
        }
      } else if (n > 0) n--;
      else {
        dir = 1;
        i = (i + 1) % roles.length;
        hold = 4;
      }
      k = (k + 1) % 14;
      setText(roles[i].slice(0, n));
      setCaret(!(hold > 0 && k >= 7));
    }, 70);
    return () => window.clearInterval(timer);
  }, [roles]);

  return (
    <span>
      {text}
      <span
        aria-hidden="true"
        className="ml-1.5 inline-block h-[22px] w-3 align-[-3px]"
        style={{ background: "rgb(var(--green))", opacity: caret ? 1 : 0 }}
      />
    </span>
  );
}
