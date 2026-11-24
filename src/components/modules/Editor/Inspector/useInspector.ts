import { useMemo, useState } from "react";
import { getBlock } from "@/blocks/registry";
import { issuesToErrors, setAt, getSchemaFields, type FieldPath } from "@/editor/schemaFields";
import { useDocumentStore } from "@/store/document.store";
import type { ISection, SectionTheme } from "@/types/document.types";

interface FormState {
  /** props из модели, от которых построен черновик */
  source: unknown;
  draft: unknown;
  errors: Record<string, string>;
}

/**
 * Черновик props секции. Каждая правка проверяется схемой блока:
 * валидный черновик сразу уходит в модель, невалидный остаётся в форме с ошибками
 * (превью не мигает defaults, пока поле временно пустое).
 * Если props поменялись снаружи (undo, другая вкладка панели) — черновик пересобирается.
 */
export const useInspector = (section: ISection) => {
  const block = getBlock(section.type);
  const fields = useMemo(() => getSchemaFields(block.schema), [block]);
  const updateSectionProps = useDocumentStore((state) => state.updateSectionProps);
  const updateSection = useDocumentStore((state) => state.updateSection);

  const fromModel = (props: unknown): FormState => {
    const parsed = block.schema.safeParse(props);
    return { source: props, draft: parsed.success ? props : block.defaults, errors: {} };
  };

  const [form, setForm] = useState<FormState>(() => fromModel(section.props));
  if (form.source !== section.props) setForm(fromModel(section.props));

  const change = (path: FieldPath, value: unknown) => {
    const draft = setAt(form.draft, path, value);
    const result = block.schema.safeParse(draft);
    if (result.success) {
      updateSectionProps(section.id, draft);
      setForm({ source: draft, draft, errors: {} });
    } else {
      setForm({ source: form.source, draft, errors: issuesToErrors(result.error.issues) });
    }
  };

  return {
    block,
    fields,
    draft: form.draft,
    errors: form.errors,
    change,
    setVariant: (variant: string) => updateSection(section.id, { variant }),
    setTheme: (theme: SectionTheme) => updateSection(section.id, { theme }),
  };
};
