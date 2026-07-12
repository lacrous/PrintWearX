export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-primary-500 focus:text-white focus:shadow-lg focus:outline-none focus:font-semibold focus:text-sm"
    >
      Skip to main content
    </a>
  );
}
