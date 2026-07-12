/**
 * Lightweight CSS-only route transition — no Framer Motion.
 *
 * Previous version used `motion.div` keyed on pathname, which loaded the
 * entire framer-motion runtime (172 KB shared chunk) on every page including
 * the storefront. Replacing it with a pure CSS keyframe animation that runs
 * once per mount brings First Load JS on the storefront down by ~170 KB and
 * makes navigation feel instant.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>;
}