import BlockThumbnail from "@/components/modules/Editor/BlockLibrary/BlockThumbnail";
import type { ITemplate } from "@/constants/templates";

interface TemplateGalleryProps {
  templates: ITemplate[];
  onSelect: (template: ITemplate) => void;
}

/** Сколько секций рисуем в миниатюре шаблона: дальше они всё равно обрезаются */
const PREVIEW_SECTIONS = 4;

/** Шаблоны страниц: миниатюра из схем секций, название и описание. Клик создаёт проект */
const TemplateGallery = ({ templates, onSelect }: TemplateGalleryProps) => {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <li key={template.id}>
          <button
            type="button"
            onClick={() => onSelect(template)}
            aria-label={`Создать проект по шаблону ${template.name}`}
            className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-[var(--color-border)] text-left transition-colors hover:border-[var(--color-primary)]"
          >
            <span className="flex h-40 flex-col gap-1 overflow-hidden bg-[var(--color-surface)] px-8 pt-4">
              {template.sections.slice(0, PREVIEW_SECTIONS).map((section, index) => (
                <BlockThumbnail key={index} type={section.type} />
              ))}
            </span>
            <span className="flex flex-col gap-1 p-3">
              <span className="font-medium">{template.name}</span>
              <span className="text-sm text-[var(--color-muted)]">{template.description}</span>
              <span className="text-sm text-[var(--color-muted)]">
                Секций: {template.sections.length}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TemplateGallery;
