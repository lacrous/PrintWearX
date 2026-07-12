"use client";
import NextLink from "next/link";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams as nextUseParams,
} from "next/navigation";
import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  forwardRef,
} from "react";

/**
 * Internal link shim.
 *
 * Uses clean URLs (e.g. "/admin/products/new") without the .html suffix.
 * The deploy CDN serves the right file via a tiny redirect script in
 * app/layout.tsx that runs in <head> before the page paints, so the
 * user never sees a wrong page.
 */
export const Link = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    to?: string;
    prefetch?: boolean;
  }
>(function Link({ href, to, onClick, prefetch, ...rest }, ref) {
  const target = (href ?? to) as string;
  const router = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      target.startsWith("http") ||
      target.startsWith("mailto:") ||
      target.startsWith("#") ||
      target === ""
    )
      return;
    e.preventDefault();
    router.push(target as any);
  };
  return (
    <NextLink
      href={target as any}
      ref={ref}
      onClick={handle}
      prefetch={prefetch}
      {...rest}
    />
  );
});

export function useNavigate() {
  const router = useRouter();
  return router.push.bind(router);
}

export function useLocation() {
  const pathname = usePathname();
  const sp = useSearchParams();
  return { pathname, search: sp.toString() ? `?${sp.toString()}` : "" };
}

export { usePathname, useSearchParams, useRouter };

export function useParams<T extends Record<string, string | undefined> = Record<string, string>>() {
  return nextUseParams() as unknown as T;
}