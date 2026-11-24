import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const VARIANTS = {
  primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
  outline:
    "border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)]",
  ghost: "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)]",
} as const;

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4",
} as const;

interface ButtonProps extends ComponentProps<"button"> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  isLoading?: boolean;
}

const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {isLoading && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
};

export default Button;
