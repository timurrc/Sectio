import { useId } from "react";
import { cn } from "@/utils/cn";

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

/** Переключатель-тумблер: подпись слева, тумблер справа */
const Switch = ({ label, checked, onChange, className }: SwitchProps) => {
  const id = useId();

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <label htmlFor={id} className="text-sm text-[var(--color-muted)]">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-[var(--color-border)] transition-colors",
          checked && "bg-[var(--color-primary)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-4",
          )}
        />
      </button>
    </div>
  );
};

export default Switch;
