import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import { useState } from "react";

interface ImageOrFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  /** Set true for above-the-fold images (skips lazy load) */
  priority?: boolean;
  /** Responsive sizes attribute */
  sizes?: string;
  /** Explicit width / height (helps prevent layout shift) */
  width?: number;
  height?: number;
}

/**
 * Responsive image with WebP sources + JPG fallback.
 * Falls back to a clean gradient placeholder on error.
 */
export function ImageOrFallback({
  src,
  alt,
  className,
  fallbackClassName,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  width,
  height,
}: ImageOrFallbackProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-500/10 dark:to-primary-700/10 text-primary-500 dark:text-primary-400",
          fallbackClassName ?? className
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageOff className="w-10 h-10" />
          <span className="text-xs font-medium opacity-70 line-clamp-2 max-w-[80%] text-center">
            {alt}
          </span>
        </div>
      </div>
    );
  }

  // For local imgs/ paths, build responsive sources
  const isImgs = src.startsWith("/imgs/");
  const base = src.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  if (isImgs) {
    return (
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
          // @ts-expect-error - fetchpriority is a valid HTML attribute
          fetchpriority={priority ? "high" : "auto"}
          onError={() => setErrored(true)}
          className={cn("object-cover", className)}
        />
      </picture>
    );
  }

  // Non-resized (OG, favicon, etc.) — just use simple WebP fallback
  const webpSrc = `${base}.webp`;
  return (
    <picture>
      <source type="image/webp" srcSet={webpSrc} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        // @ts-expect-error - fetchpriority is a valid HTML attribute
        fetchpriority={priority ? "high" : "auto"}
        onError={() => setErrored(true)}
        className={cn("object-cover", className)}
      />
    </picture>
  );
}
