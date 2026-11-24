import { VIEWPORTS } from "@/constants/editor";
import { useEditorStore } from "@/store/editor.store";
import { cn } from "@/utils/cn";

const ViewportSwitcher = () => {
  const viewport = useEditorStore((state) => state.viewport);
  const setViewport = useEditorStore((state) => state.setViewport);

  return (
    <div
      role="group"
      aria-label="Размер превью"
      className="flex gap-1 rounded-full border border-[var(--color-border)] p-1"
    >
      {VIEWPORTS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          aria-pressed={viewport === id}
          onClick={() => setViewport(id)}
          className={cn(
            "flex size-7 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]",
            viewport === id && "bg-[var(--color-surface)] text-[var(--color-text)]",
          )}
        >
          <Icon className="size-4" aria-hidden />
        </button>
      ))}
    </div>
  );
};

export default ViewportSwitcher;
