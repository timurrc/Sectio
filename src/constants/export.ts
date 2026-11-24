/** Версии зависимостей экспортируемого проекта: тот же стек, что у редактора */
export const EXPORT_DEPENDENCIES = {
  react: "^19.3.1",
  "react-dom": "^19.3.1",
};

export const EXPORT_DEV_DEPENDENCIES = {
  "@tailwindcss/vite": "^4.3.5",
  "@types/react": "^19.3.0",
  "@types/react-dom": "^19.3.0",
  "@vitejs/plugin-react": "^6.1.2",
  tailwindcss: "^4.3.5",
  typescript: "~6.0.3",
  vite: "^8.3.6",
};

/** Пути внутри экспортируемого проекта */
export const EXPORT_PATHS = {
  app: "src/App.tsx",
  container: "src/components/Container.tsx",
  sectionsDir: "src/sections",
} as const;
