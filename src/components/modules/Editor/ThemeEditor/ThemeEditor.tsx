import { TriangleAlert } from "lucide-react";
import Input from "@/components/ui/Input/Input";
import SegmentedControl from "@/components/ui/SegmentedControl/SegmentedControl";
import Textarea from "@/components/ui/Textarea/Textarea";
import { FONT_PRESETS, RADIUS_PRESETS, THEME_COLOR_FIELDS } from "@/constants/theme";
import type { SectionTheme } from "@/types/document.types";
import ColorField from "./ColorField";
import { useThemeEditor } from "./useThemeEditor";

const MODES: { id: SectionTheme; label: string }[] = [
  { id: "light", label: "Светлая" },
  { id: "dark", label: "Тёмная" },
];

/** Настройки страницы и темы. Показывается, когда ни одна секция не выбрана */
const ThemeEditor = () => {
  const { mode, setMode, meta, tokens, warnings, updateMeta, setToken } = useThemeEditor();
  if (!meta || !tokens) return null;

  const fontKnown = FONT_PRESETS.some((font) => font.id === tokens.font);

  return (
    <div className="flex flex-col">
      <h2 className="border-b border-[var(--color-border)] px-4 py-3 font-medium">Страница</h2>

      <div className="flex flex-col gap-5 p-4">
        <Input
          label="Название"
          value={meta.title}
          onChange={(event) => updateMeta({ title: event.target.value })}
        />
        <Textarea
          label="Описание для поисковиков"
          value={meta.description}
          placeholder="Одно-два предложения о продукте"
          onChange={(event) => updateMeta({ description: event.target.value })}
        />

        <hr className="border-[var(--color-border)]" />

        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-medium">Тема</h3>
          <p className="text-sm text-[var(--color-muted)]">
            Тёмная применяется к секциям, у которых выбрана тёмная тема.
          </p>
          <SegmentedControl
            label="Какую тему править"
            value={mode}
            items={MODES}
            onChange={setMode}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          {THEME_COLOR_FIELDS.map(({ key, label }) => (
            <ColorField
              key={`${mode}-${key}`}
              label={label}
              value={tokens[key]}
              onChange={(value) => setToken(key, value)}
            />
          ))}
        </div>

        {warnings.length > 0 && (
          <ul
            aria-label="Предупреждения о контрасте"
            className="flex flex-col gap-1 rounded-xl bg-[var(--color-surface)] p-3 text-sm"
          >
            {warnings.map(({ label, ratio }) => (
              <li key={label} className="flex items-center gap-2">
                <TriangleAlert className="size-4 shrink-0 text-[var(--color-danger)]" aria-hidden />
                <span className="flex-1">{label} плохо читается</span>
                <span className="text-[var(--color-muted)]">{ratio.toFixed(1)}:1</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-[var(--color-muted)]">Скругление</span>
          <SegmentedControl
            label="Скругление"
            value={tokens.radius}
            items={RADIUS_PRESETS}
            onChange={(value) => setToken("radius", value)}
          />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-[var(--color-muted)]">Шрифт</span>
          <select
            value={tokens.font}
            onChange={(event) => setToken("font", event.target.value)}
            className="h-10 cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 outline-none focus:border-[var(--color-primary)]"
          >
            {!fontKnown && <option value={tokens.font}>{tokens.font}</option>}
            {FONT_PRESETS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default ThemeEditor;
