import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { buildPath, ROUTES } from "@/constants/routes";
import { type ITemplate, TEMPLATES } from "@/constants/templates";
import { subscribeProjectsChanged } from "@/core/projectsSync";
import { createDocumentFromTemplate } from "@/core/templates";
import { useProjectsStore } from "@/store/projects.store";

export const useProjectsPage = () => {
  const navigate = useNavigate();
  const projects = useProjectsStore((state) => state.projects);
  const loaded = useProjectsStore((state) => state.loaded);
  const createProject = useProjectsStore((state) => state.createProject);
  const deleteProject = useProjectsStore((state) => state.deleteProject);

  // Список читается из IndexedDB при открытии и перечитывается, когда проекты меняет другая вкладка
  useEffect(() => {
    const { load } = useProjectsStore.getState();
    const reload = () =>
      load().catch(() => {
        toast.error("Не удалось прочитать проекты из хранилища браузера");
      });
    void reload();
    return subscribeProjectsChanged(() => void reload());
  }, []);

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
    loaded,
    templates: TEMPLATES,
    openProject,
    handleCreate: () => handleCreate(),
    handleCreateFromTemplate: (template: ITemplate) => handleCreate(template),
    handleDelete,
  };
};
