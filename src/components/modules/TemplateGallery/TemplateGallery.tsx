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
        <li
          key={template.id}
          className="relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] transition-colors focus-within:border-[var(--color-primary)] hover:border-[var(--color-primary)]"
        >
          <span
            aria-hidden
            className="flex h-40 flex-col gap-1 overflow-hidden bg-[var(--color-surface)] px-8 pt-4"
          >
            {template.sections.slice(0, PREVIEW_SECTIONS).map((section, index) => (
              <BlockThumbnail key={index} type={section.type} />
            ))}
          </span>
          <div className="flex flex-col gap-1 p-3">
            <h3 className="font-medium">
              {/* Кнопка растянута на всю карточку (after:inset-0): кликается вся карточка,
                  а доступное имя совпадает с видимым названием */}
              <button
                type="button"
                onClick={() => onSelect(template)}
                className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-[var(--color-primary)]"
              >
                <span className="sr-only">Создать проект по шаблону</span> {template.name}
              </button>
            </h3>
            <p className="text-sm text-[var(--color-muted)]">{template.description}</p>
            <p className="text-sm text-[var(--color-muted)]">Секций: {template.sections.length}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TemplateGallery;
