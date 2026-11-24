import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import ProtectedRoute from "@/components/layouts/ProtectedRoute/ProtectedRoute";
import { ROUTES } from "@/constants/routes";

// Каждая страница — отдельный чанк, грузится при переходе. Suspense — в MainLayout.
const HomePage = lazy(() => import("@/pages/HomePage/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage/LoginPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage/NotFoundPage"));

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route element={<ProtectedRoute mode="guest" />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
