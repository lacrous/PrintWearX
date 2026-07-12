"use client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@/lib/nav";
import { Search, X } from "lucide-react";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  onSubmit?: () => void;
}

export function SearchBar({ className, onSubmit }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 5);
  })();

  const go = (q: string) => {
    const next = q.trim();
    if (!next) return;
    navigate(`/search?q=${encodeURIComponent(next)}`);
    setQuery("");
    setOpen(false);
    setActiveIdx(-1);
    inputRef.current?.blur();
    onSubmit?.();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx]) go(suggestions[activeIdx].name);
      else go(query);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 z-10" />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIdx(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        className="w-full h-11 pl-11 pr-9 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-transparent dark:border-neutral-800 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-300 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          aria-label="Clear"
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50"
        >
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
            Suggestions
          </div>
          {suggestions.map((p, i) => (
            <button
              key={p.id}
              role="option"
              aria-selected={activeIdx === i}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => go(p.name)}
              className={cn(
                "w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition-colors min-h-[44px]",
                activeIdx === i
                  ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              )}
            >
              <Search className="w-3.5 h-3.5 opacity-50 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {p.category} · ${p.price}
                </p>
              </div>
              <span className="text-xs font-semibold opacity-0 group-hover:opacity-100">
                ↵
              </span>
            </button>
          ))}
          <button
            onClick={() => go(query)}
            className="w-full px-4 py-3 text-sm font-medium border-t border-neutral-200 dark:border-neutral-800 text-primary-600 dark:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors min-h-[44px]"
          >
            See all results for "{query}" →
          </button>
        </div>
      )}
    </div>
  );
}
