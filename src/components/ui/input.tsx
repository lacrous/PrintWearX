import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-12 px-4 text-base rounded-xl border bg-white dark:bg-neutral-900",
        "transition-all duration-200 ease-out",
        "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
        "text-neutral-900 dark:text-neutral-100",
        "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500",
        error
          ? "border-error focus:ring-error/30 focus:border-error"
          : "border-neutral-300 dark:border-neutral-700",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
