import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { buildPath, ROUTES } from "@/constants/routes";
import { type ITemplate, TEMPLATES } from "@/constants/templates";
import { createDocumentFromTemplate } from "@/editor/templates";
import { useProjectsStore } from "@/store/projects.store";

export const useProjectsPage = () => {
  const navigate = useNavigate();
  const projects = useProjectsStore((state) => state.projects);
  const createProject = useProjectsStore((state) => state.createProject);
  const deleteProject = useProjectsStore((state) => state.deleteProject);

  const openProject = (id: string) => navigate(buildPath(ROUTES.EDITOR, { id }));

  /** Без шаблона — пустой проект */
  const handleCreate = async (template?: ITemplate) => {
    try {
      openProject(await createProject(template && createDocumentFromTemplate(template)));
    } catch {
      toast.error("Не удалось создать проект");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
    } catch {
      toast.error("Не удалось удалить проект");
    }
  };

  return {
    projects,
    templates: TEMPLATES,
    openProject,
    handleCreate: () => handleCreate(),
    handleCreateFromTemplate: (template: ITemplate) => handleCreate(template),
    handleDelete,
  };
};
