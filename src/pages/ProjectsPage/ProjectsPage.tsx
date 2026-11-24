import { FilePlus2, Plus } from "lucide-react";
import ProjectCard from "@/components/modules/ProjectCard/ProjectCard";
import Button from "@/components/ui/Button/Button";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import { useProjectsPage } from "./useProjectsPage";

const ProjectsPage = () => {
  const { projects, openProject, handleCreate, handleDelete } = useProjectsPage();

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FilePlus2}
        title="Соберите первый лендинг"
        description="Добавляйте секции, меняйте тему и выгружайте готовый проект. Всё хранится в вашем браузере."
        action={
          <Button onClick={handleCreate}>
            <Plus className="size-4" aria-hidden />
            Новый проект
          </Button>
        }
      />
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] leading-[1.18] font-semibold tracking-[-0.01em]">Проекты</h1>
        <Button onClick={handleCreate}>
          <Plus className="size-4" aria-hidden />
          Новый проект
        </Button>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(({ id, title, updatedAt }) => (
          <ProjectCard
            key={id}
            title={title}
            updatedAt={updatedAt}
            onOpen={() => openProject(id)}
            onDelete={() => handleDelete(id)}
          />
        ))}
      </ul>
    </section>
  );
};

export default ProjectsPage;
