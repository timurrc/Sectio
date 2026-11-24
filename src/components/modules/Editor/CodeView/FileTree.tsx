import { FileCode2, Folder } from "lucide-react";
import { buildTreeRows } from "@/utils/buildTreeRows";
import { cn } from "@/utils/cn";

/** Отступ по глубине: классы целиком, чтобы Tailwind их увидел */
const INDENT = ["pl-3", "pl-6.5", "pl-10", "pl-13.5", "pl-17"];

interface FileTreeProps {
  paths: string[];
  activePath: string;
  onOpen: (path: string) => void;
}

/** Дерево файлов экспортируемого проекта */
const FileTree = ({ paths, activePath, onOpen }: FileTreeProps) => {
  return (
    <ul aria-label="Файлы проекта" className="flex flex-col py-2 text-sm">
      {buildTreeRows(paths).map((row) => {
        const indent = INDENT[Math.min(row.depth, INDENT.length - 1)];
        if (row.kind === "dir") {
          return (
            <li
              key={row.path}
              className={cn("flex h-7 items-center gap-2 text-[var(--color-muted)]", indent)}
            >
              <Folder className="size-4 shrink-0" aria-hidden />
              {row.name}
            </li>
          );
        }
        const isActive = row.path === activePath;
        return (
          <li key={row.path}>
            <button
              type="button"
              aria-current={isActive ? "true" : undefined}
              onClick={() => onOpen(row.path)}
              className={cn(
                "flex h-7 w-full cursor-pointer items-center gap-2 pr-3 text-left text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]",
                indent,
                isActive && "bg-[var(--color-surface)] text-[var(--color-text)]",
              )}
            >
              <FileCode2 className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{row.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default FileTree;
