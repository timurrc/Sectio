import { LayoutTemplate, Trash2 } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

interface ProjectCardProps {
  title: string;
  updatedAt: number;
  onOpen: () => void;
  onDelete: () => void;
}

/** Карточка проекта. Удаление в два шага: сначала подтверждение, потом действие */
const ProjectCard = ({ title, updatedAt, onOpen, onDelete }: ProjectCardProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)]">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Открыть проект ${title}`}
        className="flex h-32 cursor-pointer items-center justify-center bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
      >
        <LayoutTemplate className="size-8" aria-hidden />
      </button>

      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{title}</span>
          <span className="text-sm text-[var(--color-muted)]">
            Изменён {formatRelativeTime(updatedAt)}
          </span>
        </div>

        {isConfirming ? (
          <div className="flex shrink-0 gap-1">
            <Button size="sm" variant="outline" onClick={() => setIsConfirming(false)}>
              Отмена
            </Button>
            <Button
              size="sm"
              className="bg-[var(--color-danger)] hover:opacity-90"
              onClick={onDelete}
            >
              Удалить
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Удалить проект ${title}`}
            onClick={() => setIsConfirming(true)}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        )}
      </div>
    </li>
  );
};

export default ProjectCard;
