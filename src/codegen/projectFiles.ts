import { EXPORT_DEPENDENCIES, EXPORT_DEV_DEPENDENCIES } from "@/constants/export";
import { themeToCss } from "@/core/themeToCss";
import type { IDocument } from "@/types/document.types";

/**
 * Неизменная обвязка проекта: конфиги, точка входа, стили, Container.
 * Это шаблоны, а не разбор кода: данные документа только подставляются (с экранированием).
 */

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Имя npm-пакета из названия: латиница, цифры и дефисы */
export const toPackageName = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "landing";

/** Имя файла архива: название как есть, без символов, запрещённых в именах файлов */
export const toFileName = (title: string) =>
  title
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "landing";

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

export const packageJson = (doc: IDocument) =>
  json({
    name: toPackageName(doc.meta.title),
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: { dev: "vite", build: "tsc -b && vite build", preview: "vite preview" },
    dependencies: EXPORT_DEPENDENCIES,
    devDependencies: EXPORT_DEV_DEPENDENCIES,
  });

export const tsconfigJson = () =>
  json({
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      moduleResolution: "bundler",
      jsx: "react-jsx",
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      types: ["vite/client"],
    },
    include: ["src", "vite.config.ts"],
  });

export const viteConfig = () => `import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

export const indexHtml = (doc: IDocument) => {
  const description = doc.meta.description.trim();
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(doc.meta.title)}</title>${
      description ? `\n    <meta name="description" content="${escapeHtml(description)}" />` : ""
    }
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
};

export const mainTsx = () => `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

/** Те же токены и базовые стили, что в превью (preview.css + themeToCss) */
export const indexCss = (doc: IDocument) => `@import "tailwindcss";

/* Тёмная секция: класс dark на обёртке секции */
@custom-variant dark (&:where(.dark, .dark *));

/* Токены темы: light на :root, dark на .dark */
${themeToCss(doc.theme)}
@layer base {
  body {
    @apply bg-[var(--color-bg)] text-[var(--color-text)] antialiased;
    font-family: var(--font, system-ui, sans-serif);
  }
}
`;

/** Копия blocks/shared/Container.tsx */
export const containerTsx = () => `import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return <div className={\`mx-auto w-full max-w-6xl px-6 \${className}\`}>{children}</div>;
};

export default Container;
`;

export const readme = (doc: IDocument) => `# ${doc.meta.title}

Лендинг, собранный в Sectio: Vite + React + TypeScript + Tailwind CSS v4.

## Запуск

\`\`\`bash
npm install
npm run dev
\`\`\`

Сборка: \`npm run build\`, результат — в папке \`dist\`.

## Структура

- \`src/App.tsx\` — порядок секций на странице
- \`src/sections/\` — по файлу на секцию; тексты лежат в константе \`content\` в начале файла
- \`src/index.css\` — цвета, скругление и шрифт темы (CSS-переменные; тёмная тема — класс \`dark\`)
`;

export const gitignore = () => `node_modules
dist
*.local
.DS_Store
`;
