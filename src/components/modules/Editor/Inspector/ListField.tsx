import { ArrowDown, ArrowUp, ChevronRight, Plus, X } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { emptyValue, getAt, pathKey, type FieldNode } from "@/editor/schemaFields";
import SchemaField, { type IFieldProps } from "./SchemaField";

type ListNode = Extract<FieldNode, { kind: "list" }>;

/** Первая непустая строка элемента — подпись свёрнутой карточки */
const summaryOf = (item: unknown) =>
  item && typeof item === "object"
    ? Object.values(item).find((value): value is string => typeof value === "string" && !!value)
    : undefined;

/** Массив из схемы: строки — списком полей, объекты — сворачиваемыми карточками */
const ListField = ({ node, path, root, errors, onChange }: IFieldProps & { node: ListNode }) => {
  const items = (getAt(root, path) as unknown[] | undefined) ?? [];
  const canAdd = items.length < node.max;
  const canRemove = items.length > node.min;
  const error = errors[pathKey(path)];
  const itemName = node.itemLabel.toLowerCase();

  const set = (next: unknown[]) => onChange(path, next);
  const add = () =>
    set([...items, items.length ? structuredClone(items.at(-1)) : emptyValue(node.item)]);
  const remove = (index: number) => set(items.filter((_, i) => i !== index));
  const move = (index: number, offset: number) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + offset, 0, item);
    set(next);
  };

  const removeButton = (index: number) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => remove(index)}
      disabled={!canRemove}
      aria-label={`Удалить: ${node.itemLabel} ${index + 1}`}
      title={canRemove ? "Удалить" : `Нужно хотя бы ${node.min}`}
    >
      <X className="size-4" aria-hidden />
    </Button>
  );

  // min-w-0: у fieldset по умолчанию min-width: min-content, длинные строки распирали панель
  return (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <legend className="mb-2 flex w-full items-baseline justify-between text-sm font-medium">
        {node.label}
        <span className="font-normal text-[var(--color-muted)]">
          {items.length}
          {Number.isFinite(node.max) && ` из ${node.max}`}
        </span>
      </legend>

      {items.map((item, index) =>
        node.item.kind === "text" ? (
          <div key={index} className="flex items-start gap-1">
            <div className="flex-1">
              <Input
                aria-label={`${node.itemLabel} ${index + 1}`}
                value={typeof item === "string" ? item : ""}
                error={errors[pathKey([...path, index])]}
                onChange={(event) => onChange([...path, index], event.target.value)}
              />
            </div>
            <div className="pt-1">{removeButton(index)}</div>
          </div>
        ) : (
          <details
            key={index}
            className="group rounded-xl border border-[var(--color-border)] open:pb-3"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm">
              <ChevronRight
                className="size-4 shrink-0 text-[var(--color-muted)] transition-transform group-open:rotate-90"
                aria-hidden
              />
              <span className="min-w-0 truncate">
                {node.itemLabel} {index + 1}
                {summaryOf(item) && (
                  <span className="text-[var(--color-muted)]"> · {summaryOf(item)}</span>
                )}
              </span>
            </summary>
            <div className="flex flex-col gap-3 px-3">
              <SchemaField
                node={node.item}
                path={[...path, index]}
                root={root}
                errors={errors}
                onChange={onChange}
              />
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Выше: ${node.itemLabel} ${index + 1}`}
                >
                  <ArrowUp className="size-4" aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label={`Ниже: ${node.itemLabel} ${index + 1}`}
                >
                  <ArrowDown className="size-4" aria-hidden />
                </Button>
                {removeButton(index)}
              </div>
            </div>
          </details>
        ),
      )}

      {error && <span className="text-sm text-[var(--color-danger)]">{error}</span>}

      <Button
        variant="outline"
        size="sm"
        onClick={add}
        disabled={!canAdd}
        title={canAdd ? undefined : `Не больше ${node.max}`}
        className="self-start"
      >
        <Plus className="size-4" aria-hidden />
        Добавить {itemName}
      </Button>
    </fieldset>
  );
};

export default ListField;
