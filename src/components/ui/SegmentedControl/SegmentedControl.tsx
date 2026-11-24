import { cn } from "@/utils/cn";

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  items: { id: T; label: string }[];
  onChange: (id: T) => void;
  className?: string;
}

/** Выбор одного из нескольких вариантов: pill-группа, как переключатель вьюпорта */
const SegmentedControl = <T extends string>({
  label,
  value,
  items,
  onChange,
  className,
}: SegmentedControlProps<T>) => {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex gap-1 rounded-full border border-[var(--color-border)] p-1", className)}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="radio"
          aria-checked={value === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "h-7 flex-1 cursor-pointer truncate rounded-full px-3 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]",
            value === item.id && "bg-[var(--color-surface)] text-[var(--color-text)]",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
