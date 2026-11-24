import { useId, type ComponentProps } from "react";
import { cn } from "@/utils/cn";

// ComponentProps<"input"> включает ref — в React 19 он передаётся как обычный проп,
// поэтому {...register("email")} из react-hook-form работает без forwardRef.
interface InputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, id, className, ...props }: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-[var(--color-muted)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 transition-colors outline-none focus:border-[var(--color-primary)]",
          error && "border-[var(--color-danger)]",
          className,
        )}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-sm text-[var(--color-danger)]">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
