import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import EditorLayout from "@/components/layouts/EditorLayout/EditorLayout";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import { ROUTES } from "@/constants/routes";

// Каждая страница — отдельный чанк, грузится при переходе. Suspense — в лейаутах.
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage/ProjectsPage"));
const EditorPage = lazy(() => import("@/pages/EditorPage/EditorPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage/NotFoundPage"));

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<ProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<EditorLayout />}>
        <Route path={ROUTES.EDITOR} element={<EditorPage />} />
      </Route>
    </Routes>
  );
};

export default App;
