import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { useProjectsPage } from "./useProjectsPage";

const ProjectsPage = () => {
  const { projects, openProject, handleCreate, handleDelete } = useProjectsPage();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Проекты</h1>
        <Button onClick={handleCreate}>
          <Plus className="size-4" aria-hidden />
          Новый проект
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-[var(--color-muted)]">Проектов пока нет. Создайте первый лендинг.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(({ id, title, updatedAt }) => (
            <li
              key={id}
              className="flex items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <button
                type="button"
                onClick={() => openProject(id)}
                className="flex min-w-0 flex-1 flex-col items-start text-left"
              >
                <span className="w-full truncate font-medium">{title}</span>
                <span className="text-sm text-[var(--color-muted)]">
                  {new Date(updatedAt).toLocaleString("ru-RU")}
                </span>
              </button>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Удалить проект ${title}`}
                onClick={() => handleDelete(id)}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProjectsPage;
