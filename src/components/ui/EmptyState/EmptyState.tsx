import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Следующее действие: у пустого состояния оно обязательно */
  action?: ReactNode;
}

/** Пустое состояние: что произошло и что сделать дальше */
const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-[var(--color-surface)]">
        <Icon className="size-5 text-[var(--color-muted)]" aria-hidden />
      </span>
      <h2 className="text-lg font-medium">{title}</h2>
      {description && <p className="max-w-sm text-[var(--color-muted)]">{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
