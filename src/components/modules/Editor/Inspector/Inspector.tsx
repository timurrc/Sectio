import { ArrowDown, ArrowUp, Copy, Trash2, X } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import SegmentedControl from "@/components/ui/SegmentedControl/SegmentedControl";
import { duplicateSectionById, moveSectionBy, removeSectionById } from "@/editor/commands";
import { HOTKEY_HINTS } from "@/editor/hotkeys";
import { useEditorStore } from "@/store/editor.store";
import type { ISection, SectionTheme } from "@/types/document.types";
import SchemaField from "./SchemaField";
import { useInspector } from "./useInspector";

const THEMES: { id: SectionTheme; label: string }[] = [
  { id: "light", label: "Светлая" },
  { id: "dark", label: "Тёмная" },
];

interface InspectorProps {
  section: ISection;
}

/** Свойства выбранной секции. Форма строится по zod-схеме блока */
const Inspector = ({ section }: InspectorProps) => {
  const { block, fields, draft, errors, change, setVariant, setTheme } = useInspector(section);
  const select = useEditorStore((state) => state.select);

  const actions = [
    {
      label: "Выше",
      icon: ArrowUp,
      hint: HOTKEY_HINTS.moveUp,
      run: () => moveSectionBy(section.id, -1),
    },
    {
      label: "Ниже",
      icon: ArrowDown,
      hint: HOTKEY_HINTS.moveDown,
      run: () => moveSectionBy(section.id, 1),
    },
    {
      label: "Дублировать",
      icon: Copy,
      hint: HOTKEY_HINTS.duplicate,
      run: () => duplicateSectionById(section.id),
    },
    {
      label: "Удалить",
      icon: Trash2,
      hint: HOTKEY_HINTS.delete,
      run: () => removeSectionById(section.id),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 border-b border-[var(--color-border)] px-3 py-2">
        <h2 className="flex-1 truncate font-medium">{block.name}</h2>
        {actions.map(({ label, icon: Icon, hint, run }) => (
          <Button
            key={label}
            variant="ghost"
            size="icon"
            onClick={run}
            aria-label={label}
            title={`${label} (${hint})`}
          >
            <Icon className="size-4" aria-hidden />
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => select(null)}
          aria-label="Закрыть свойства секции"
          title={`Закрыть (${HOTKEY_HINTS.deselect})`}
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {block.variants.length > 1 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-[var(--color-muted)]">Вариант</span>
            <SegmentedControl
              label="Вариант раскладки"
              value={section.variant}
              items={block.variants.map(({ id, name }) => ({ id, label: name }))}
              onChange={setVariant}
            />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-[var(--color-muted)]">Тема секции</span>
          <SegmentedControl
            label="Тема секции"
            value={section.theme}
            items={THEMES}
            onChange={setTheme}
          />
        </div>

        <hr className="border-[var(--color-border)]" />

        {fields.map((field) => (
          <SchemaField
            key={field.key}
            node={field}
            path={[field.key]}
            root={draft}
            errors={errors}
            onChange={change}
          />
        ))}
      </div>
    </div>
  );
};

export default Inspector;
