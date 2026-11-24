import { LayoutTemplate } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Container from "@/components/layouts/Container/Container";

const Header = () => {
  return (
    <header className="border-b border-[var(--color-border)]">
      <Container className="flex h-16 items-center">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 text-lg font-medium">
          <LayoutTemplate className="size-5 text-[var(--color-primary)]" aria-hidden />
          Sectio
        </Link>
      </Container>
    </header>
  );
};

export default Header;
