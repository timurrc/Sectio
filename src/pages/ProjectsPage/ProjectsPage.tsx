import { FilePlus2, Plus } from "lucide-react";
import ProjectCard from "@/components/modules/ProjectCard/ProjectCard";
import TemplateGallery from "@/components/modules/TemplateGallery/TemplateGallery";
import Button from "@/components/ui/Button/Button";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import PageLoader from "@/components/ui/PageLoader/PageLoader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProjectsPage } from "./useProjectsPage";

const ProjectsPage = () => {
  const {
    projects,
    loaded,
    templates,
    openProject,
    handleCreate,
    handleCreateFromTemplate,
    handleDelete,
  } = useProjectsPage();

  const gallery = (
    <section aria-labelledby="templates-title" className="flex flex-col gap-4">
      <h2 id="templates-title" className="text-lg font-medium">
        Начать с шаблона
      </h2>
      <TemplateGallery templates={templates} onSelect={handleCreateFromTemplate} />
    </section>
  );

  useDocumentTitle();

  if (!loaded) return <PageLoader />;

  if (projects.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyState
          icon={FilePlus2}
          title="Соберите первый лендинг"
          description="Добавляйте секции, меняйте тему и выгружайте готовый проект. Всё хранится в вашем браузере."
          action={
            <Button onClick={handleCreate}>
              <Plus className="size-4" aria-hidden />
              Пустой проект
            </Button>
          }
        />
        {gallery}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
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

      {gallery}
    </div>
  );
};

export default ProjectsPage;
