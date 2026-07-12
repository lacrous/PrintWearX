"use client";

import { useState, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Upload, X, Plus, Trash2 } from "lucide-react";

interface FieldProps {
  label: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  error?: string;
}

export function Field({ label, description, required, children, className, error }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-sm font-semibold text-neutral-900 dark:text-white">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {description && (
        <p className="text-xs text-neutral-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-error font-medium">{error}</p>
      )}
    </div>
  );
}

export function FormRow({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  return (
    <div className={cn(
      "grid gap-4",
      cols === 2 && "sm:grid-cols-2",
      cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
      cols === 4 && "sm:grid-cols-2 lg:grid-cols-4",
    )}>
      {children}
    </div>
  );
}

export function Section({
  title,
  description,
  headerAction,
  children,
}: {
  title: string;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">{title}</h2>
          {description && (
            <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
          )}
        </div>
        {headerAction}
      </div>
      {children}
    </section>
  );
}

export function Input({ className, prefix, suffix, ...rest }: InputHTMLAttributes<HTMLInputElement> & { prefix?: string; suffix?: string }) {
  // Long prefixes (URL slugs, paths) render as a chip above the input on small
  // screens and as an inline left-padded text on larger screens. Short prefixes
  // ($, %) stay inline everywhere.
  const longPrefix = !!prefix && prefix.length > 8;
  if (longPrefix) {
    return (
      <div className="space-y-1.5">
        <span className="inline-block px-2 py-0.5 rounded-md bg-neutral-200/60 dark:bg-neutral-700/60 text-xs text-neutral-600 dark:text-neutral-300 font-mono">
          {prefix}
        </span>
        <input
          {...rest}
          className={cn(
            "w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent",
            "focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
            "text-sm transition-colors",
            suffix && "pr-12",
            className
          )}
        />
      </div>
    );
  }
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-mono pointer-events-none select-none">
          {prefix}
        </span>
      )}
      <input
        {...rest}
        className={cn(
          "w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent",
          "focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
          "text-sm transition-colors",
          prefix && "pl-8",
          suffix && "pr-12",
          className
        )}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-mono">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      className={cn(
        "w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent",
        "focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
        "text-sm transition-colors resize-y min-h-[100px]",
        className
      )}
    />
  );
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...rest}
        className={cn(
          "w-full h-10 pl-3 pr-9 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent",
          "focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
          "text-sm transition-colors appearance-none cursor-pointer",
          className
        )}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label?: string; description?: string }) {
  const inner = (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex items-center w-10 h-6 rounded-full transition-colors shrink-0",
        checked ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-700"
      )}
    >
      <span
        className={cn(
          "inline-block w-5 h-5 bg-white rounded-full shadow transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
  if (!label) return inner;
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-t border-neutral-100 dark:border-neutral-800 first:border-0 first:pt-0">
      <div>
        <div className="text-sm font-semibold text-neutral-900 dark:text-white">{label}</div>
        {description && <div className="text-xs text-neutral-500 mt-0.5">{description}</div>}
      </div>
      {inner}
    </div>
  );
}

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUpload({ value = [], onChange, max = 8 }: ImageUploadProps) {
  const addDemo = () => {
    if (value.length >= max) return;
    const gradients = [
      "from-primary-500 to-primary-700",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-teal-600",
      "from-pink-500 to-rose-600",
      "from-info to-blue-600",
      "from-purple-500 to-indigo-600",
    ];
    const i = value.length % gradients.length;
    onChange([...value, gradients[i]]);
  };
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {value.map((g, i) => (
          <div
            key={i}
            className={cn("relative aspect-square rounded-xl bg-gradient-to-br", g)}
          >
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white hover:bg-black"
              aria-label="Remove"
            >
              <X className="w-3 h-3" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold uppercase tracking-wider">
                Main
              </span>
            )}
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={addDemo}
            className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-500/10 transition-colors flex flex-col items-center justify-center gap-1 text-neutral-500 hover:text-primary-500"
          >
            <Upload className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Upload</span>
          </button>
        )}
      </div>
      <p className="text-[11px] text-neutral-500 mt-2">
        {value.length} / {max} images · PNG, JPG, WebP up to 10 MB
      </p>
    </div>
  );
}

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}

export function TagsInput({ value, onChange, suggestions = [] }: TagsInputProps) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim().toLowerCase();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 text-xs font-semibold border border-primary-200/50 dark:border-primary-500/20"
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== t))}
              aria-label={`Remove ${t}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Add tag…"
          className="flex-1 h-9 px-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="h-9 px-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold inline-flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mr-1 self-center">Suggested:</span>
          {suggestions.filter((s) => !value.includes(s)).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange([...value, s])}
              className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Repeater<T extends { id: string }>({
  items,
  onChange,
  render,
  addLabel,
  empty,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, update: (t: T) => void, remove: () => void) => ReactNode;
  addLabel: string;
  empty?: ReactNode;
}) {
  const add = () => {
    onChange([
      ...items,
      { id: `new-${Date.now()}` } as T,
    ]);
  };
  return (
    <div className="space-y-2">
      {items.length === 0 && empty}
      {items.map((it) =>
        <div key={it.id}>
          {render(it, (next) => onChange(items.map((x) => x.id === it.id ? next : x)), () => onChange(items.filter((x) => x.id !== it.id)))}
        </div>
      )}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
      >
        <Plus className="w-3.5 h-3.5" />
        {addLabel}
      </button>
    </div>
  );
}

export function FormActions({
  onCancel,
  submitLabel = "Save changes",
  secondary,
}: {
  onCancel: () => void;
  submitLabel?: string;
  secondary?: { label: string; onClick: () => void };
}) {
  return (
<div className="sticky bottom-0 z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="h-10 px-3 sm:px-4 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        Cancel
      </button>
      {secondary && (
        <button
          type="button"
          onClick={secondary.onClick}
          className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-medium"
        >
          {secondary.label}
        </button>
      )}
      <button
        type="submit"
        className="h-10 px-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
      >
        {submitLabel}
      </button>
    </div>
  );
}

export function SaveButton({ label = "Save changes" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="h-10 px-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
    >
      {label}
    </button>
  );
}

export function PageHeader({
  title,
  description,
  back,
  actions,
  breadcrumb,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
  breadcrumb?: Array<{ href?: string; label: string }>;
}) {
  return (
    <div className="space-y-3">
      {breadcrumb && (
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500">
          {breadcrumb.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              {b.href ? (
                <a href={b.href} className="hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                  {b.label}
                </a>
              ) : (
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">{b.label}</span>
              )}
              {i < breadcrumb.length - 1 && <span className="text-neutral-400">/</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {back && (
            <a
              href={back.href}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0"
              aria-label={`Back to ${back.label}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </a>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white truncate">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-neutral-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0 -mr-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}