"use client";

import { useState } from "react";

/** Print / save as PDF, and copy the résumé as plain text. */
export function ResumeActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="print:hidden">
      <button type="button" onClick={() => window.print()} className="px-btn px-btn-primary cursor-pointer">
        Print / save as PDF
      </button>
      <br />
      <button
        type="button"
        onClick={() => {
          navigator.clipboard
            .writeText(text)
            .then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {});
        }}
        className="px-btn px-btn-ghost cursor-pointer"
      >
        {copied ? "Copied" : "Copy plain text"}
      </button>
    </div>
  );
}
