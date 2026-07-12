import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  size = "md",
  className,
}: Props) {
  const decrement = () => value > min && onChange(value - 1);
  const increment = () => onChange(value + 1);

  const btnSize = size === "sm" ? "w-9 h-9 min-w-[36px]" : "w-11 h-11 min-w-[44px]";
  const inputSize = size === "sm" ? "w-14 h-9 text-sm" : "w-16 h-11 text-base";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "inline-flex items-center justify-center rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors",
          "hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400",
          "disabled:opacity-40 disabled:pointer-events-none",
          btnSize
        )}
      >
        <Minus className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (Number.isFinite(v) && v >= min) onChange(v);
          else if (e.target.value === "") onChange(min);
        }}
        aria-label="Quantity"
        className={cn(
          "text-center bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-transparent dark:border-neutral-700 font-semibold text-neutral-900 dark:text-neutral-100",
          "focus:outline-none focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-300 dark:focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all",
          inputSize
        )}
      />
      <button
        onClick={increment}
        aria-label="Increase quantity"
        className={cn(
          "inline-flex items-center justify-center rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors",
          "hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400",
          btnSize
        )}
      >
        <Plus className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </button>
    </div>
  );
}
