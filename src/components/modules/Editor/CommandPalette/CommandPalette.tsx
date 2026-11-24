import { Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCommandPalette } from "./useCommandPalette";

/** Палитра команд ⌘K: блоки с вариантами, действия над секцией, шаблоны. Грузится лениво */
const CommandPalette = () => {
  const {
    listId,
    query,
    changeQuery,
    results,
    activeItem,
    setActiveIndex,
    onKeyDown,
    run,
    close,
    optionId,
  } = useCommandPalette();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[var(--color-text)]/20 px-4 pt-[12vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Палитра команд"
        className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4">
          <Search className="size-4 shrink-0 text-[var(--color-muted)]" aria-hidden />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeItem ? optionId(activeItem) : undefined}
            aria-label="Поиск блоков и команд"
            placeholder="Блок, действие или шаблон…"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            onKeyDown={onKeyDown}
            className="h-12 flex-1 bg-transparent outline-none placeholder:text-[var(--color-muted)]"
          />
          <kbd className="rounded-md border border-[var(--color-border)] px-1.5 text-xs text-[var(--color-muted)]">
            Esc
          </kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-10 text-center text-[var(--color-muted)]">
            Ничего не нашлось. Попробуйте «отзывы», «тарифы» или «шаблон»
          </p>
        ) : (
          <ul id={listId} role="listbox" aria-label="Результаты" className="overflow-y-auto p-2">
            {results.map((item, index) => {
              const isActive = item === activeItem;
              const showGroup = index === 0 || results[index - 1].group !== item.group;
              return (
                <li key={item.id} role="presentation">
                  {showGroup && (
                    <p
                      role="presentation"
                      className="px-3 pt-2 pb-1 text-xs font-medium text-[var(--color-muted)]"
                    >
                      {item.group}
                    </p>
                  )}
                  <div
                    id={optionId(item)}
                    role="option"
                    aria-selected={isActive}
                    ref={(node) => {
                      if (isActive) node?.scrollIntoView?.({ block: "nearest" });
                    }}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => run(item)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2",
                      isActive && "bg-[var(--color-surface)]",
                    )}
                  >
                    <span className="flex-1 truncate">
                      {item.title}
                      {item.subtitle && (
                        <span className="text-[var(--color-muted)]"> · {item.subtitle}</span>
                      )}
                    </span>
                    {item.hint && (
                      <kbd className="text-xs text-[var(--color-muted)]">{item.hint}</kbd>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommandPalette;
