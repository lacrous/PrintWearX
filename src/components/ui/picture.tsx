"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PictureProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  /** Object-fit for the img */
  fit?: "cover" | "contain";
  /** Background color while loading (matches dominant color if known) */
  bg?: string;
}

/**
 * Responsive image component:
 * - Serves WebP at 480 / 768 / 1080 / 1600 widths
 * - Falls back to original JPG for ancient browsers
 * - Lazy loads by default; `priority` for above-the-fold
 * - Shows a soft gradient placeholder until decoded
 */
export function Picture({
  src,
  alt,
  className,
  width,
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  fit = "cover",
  bg = "from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700",
}: PictureProps) {
  const [loaded, setLoaded] = useState(false);

  // src like "/imgs/sunset_wave_tee.jpg"
  const base = src.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  // WebP sources (we generated these at build time)
  const webpSrc = `${base}.webp`;

  // Build a <picture> with multiple <source> elements
  // For local imgs/, we have responsive sizes; for OG/favicons, just one
  const isImgs = src.startsWith("/imgs/");

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        bg,
        className
      )}
      style={width || height ? { aspectRatio: width && height ? `${width} / ${height}` : undefined } : undefined}
    >
      {isImgs ? (
        <picture>
          <source
            type="image/webp"
            sizes={sizes}
            srcSet={`
              ${base}-480.webp 480w,
              ${base}-768.webp 768w,
              ${base}-1080.webp 1080w,
              ${base}-1600.webp 1600w
            `.trim()}
          />
          <source
            type="image/jpeg"
            sizes={sizes}
            srcSet={`
              ${base}-480.jpg 480w,
              ${base}-768.jpg 768w,
              ${base}-1080.jpg 1080w,
              ${base}-1600.jpg 1600w
            `.trim()}
          />
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
            onLoad={() => setLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              fit === "contain" && "object-contain",
              loaded ? "opacity-100" : "opacity-0"
            )}
            style={{ objectFit: fit }}
          />
        </picture>
      ) : (
        // For OG / favicon / non-resized: just use plain <img> with webp
        <picture>
          <source type="image/webp" srcSet={webpSrc} />
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
            onLoad={() => setLoaded(true)}
            className={cn(
              "w-full h-full transition-opacity duration-500",
              fit === "cover" && "object-cover",
              fit === "contain" && "object-contain",
              loaded ? "opacity-100" : "opacity-0"
            )}
            style={{ objectFit: fit }}
          />
        </picture>
      )}
    </div>
  );
}
