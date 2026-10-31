import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Shown under the image. Say what the reader is looking at, not "screenshot". */
  caption?: string;
  /** Where this thing actually lives, if it is online. */
  href?: string;
};

/** A screenshot in a bordered frame, with a caption. Proof beats description. */
export function Figure({ src, alt, caption, href }: Props) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={750}
      sizes="(max-width: 900px) 100vw, 760px"
      className="block h-auto w-full"
    />
  );
  return (
    <figure className="m-0 my-10 max-w-[780px]">
      <div className="bg-slot p-1 shadow-[0_0_0_4px_rgb(var(--border)),8px_12px_0_rgb(var(--shade))]">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="block">
            {image}
          </a>
        ) : (
          image
        )}
      </div>
      {caption && (
        <figcaption className="px-label mt-5 text-pretty normal-case tracking-normal">
          {caption}
          {href && (
            <>
              {" "}
              <a href={href} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
                See it live
              </a>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}
