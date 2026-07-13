import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Shown under the image. Say what the reader is looking at, not "screenshot". */
  caption?: string;
  /** Where this thing actually lives, if it's online. */
  href?: string;
};

/** A captioned screenshot for MDX. Proof beats description. */
export function Figure({ src, alt, caption, href }: Props) {
  const image = (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 672px"
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );

  return (
    <figure className="not-prose my-10">
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="group block">
          {image}
        </a>
      ) : (
        image
      )}

      {caption && (
        <figcaption className="mt-3 text-pretty text-sm leading-relaxed text-fg-subtle">
          {caption}
          {href && (
            <>
              {" "}
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline underline-offset-2 hover:opacity-80"
              >
                See it live
              </a>
              .
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}
