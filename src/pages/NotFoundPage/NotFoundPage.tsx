import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const NotFoundPage = () => {
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-5xl font-medium">404</h1>
      <p className="text-[var(--color-muted)]">Страница не найдена</p>
      <Link to={ROUTES.HOME} className="text-[var(--color-primary-text)]">
        На главную
      </Link>
    </section>
  );
};

export default NotFoundPage;
