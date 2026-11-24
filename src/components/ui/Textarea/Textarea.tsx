import { useId, type ComponentProps } from "react";
import { cn } from "@/utils/cn";

interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  error?: string;
}

/** Многострочное поле в стиле Input; высота растёт под текст (field-sizing) */
const Textarea = ({ label, error, id, className, ...props }: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm text-[var(--color-muted)]">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "field-sizing-content min-h-16 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 transition-colors outline-none focus:border-[var(--color-primary)]",
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

export default Textarea;
