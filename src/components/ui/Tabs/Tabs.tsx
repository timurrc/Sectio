import { cn } from "@/utils/cn";

interface TabsProps<T extends string> {
  label: string;
  value: T;
  items: { id: T; label: string }[];
  onChange: (id: T) => void;
  className?: string;
}

/** Переключатель вкладок: подчёркнутая активная, без заливок */
const Tabs = <T extends string>({ label, value, items, onChange, className }: TabsProps<T>) => {
  return (
    <div role="tablist" aria-label={label} className={cn("flex gap-4", className)}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={value === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "-mb-px cursor-pointer border-b-2 border-transparent pb-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]",
            value === item.id && "border-[var(--color-text)] text-[var(--color-text)]",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
