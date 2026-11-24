import { useState } from "react";
import { isHexColor } from "@/editor/color";
import { cn } from "@/utils/cn";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Цвет: нативная пипетка + поле hex. В модель уходит только валидный #rrggbb */
const ColorField = ({ label, value, onChange }: ColorFieldProps) => {
  const [text, setText] = useState({ source: value, draft: value });
  if (text.source !== value) setText({ source: value, draft: value });
  const isValid = isHexColor(text.draft);

  const handleText = (draft: string) => {
    const next = `#${draft.replace(/#/g, "").trim()}`;
    setText({ source: value, draft: next });
    if (isHexColor(next)) onChange(next.toLowerCase());
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label={`${label}: пипетка`}
        value={isHexColor(value) ? value : "#000000"}
        onChange={(event) => onChange(event.target.value)}
        className="size-8 shrink-0 cursor-pointer rounded-full border border-[var(--color-border)] bg-transparent p-0 [&::-moz-color-swatch]:rounded-full [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
      />
      <span className="flex-1 truncate text-sm">{label}</span>
      <input
        aria-label={label}
        aria-invalid={!isValid}
        value={text.draft}
        maxLength={7}
        spellCheck={false}
        onChange={(event) => handleText(event.target.value)}
        className={cn(
          "h-8 w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 font-mono text-sm uppercase outline-none focus:border-[var(--color-primary)]",
          !isValid && "border-[var(--color-danger)]",
        )}
      />
    </div>
  );
};

export default ColorField;
