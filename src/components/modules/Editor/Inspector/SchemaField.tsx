import Input from "@/components/ui/Input/Input";
import Switch from "@/components/ui/Switch/Switch";
import Textarea from "@/components/ui/Textarea/Textarea";
import { getAt, pathKey, type FieldNode, type FieldPath } from "@/editor/schemaFields";
import ListField from "./ListField";

export interface IFieldProps {
  node: FieldNode;
  path: FieldPath;
  /** Весь черновик props: значение поля берётся по path */
  root: unknown;
  errors: Record<string, string>;
  onChange: (path: FieldPath, value: unknown) => void;
}

/** Одно поле инспектора по типу из zod-схемы */
const SchemaField = (props: IFieldProps) => {
  const { node, path, root, errors, onChange } = props;
  const value = getAt(root, path);
  const error = errors[pathKey(path)];

  switch (node.kind) {
    case "text": {
      const common = {
        label: node.label,
        error,
        value: typeof value === "string" ? value : "",
        required: node.required,
      };
      return node.multiline ? (
        <Textarea {...common} onChange={(event) => onChange(path, event.target.value)} />
      ) : (
        <Input {...common} onChange={(event) => onChange(path, event.target.value)} />
      );
    }
    case "number":
      return (
        <Input
          type="number"
          label={node.label}
          error={error}
          value={typeof value === "number" ? value : 0}
          onChange={(event) => onChange(path, event.target.valueAsNumber || 0)}
        />
      );
    case "boolean":
      return (
        <Switch
          label={node.label}
          checked={value === true}
          onChange={(next) => onChange(path, next)}
        />
      );
    case "object":
      return (
        <fieldset className="flex flex-col gap-3">
          {node.label && <legend className="mb-2 text-sm font-medium">{node.label}</legend>}
          {node.fields.map((field) => (
            <SchemaField key={field.key} {...props} node={field} path={[...path, field.key]} />
          ))}
        </fieldset>
      );
    case "list":
      return <ListField {...props} node={node} />;
    default:
      return null;
  }
};

export default SchemaField;
