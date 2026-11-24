import { LogIn, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { selectIsAuth, useAuthStore } from "@/store/auth.store";
import { cn } from "@/utils/cn";
import Container from "@/components/layouts/Container/Container";
import Button from "@/components/ui/Button/Button";

const Header = () => {
  const isAuth = useAuthStore(selectIsAuth);
  const logout = useAuthStore((state) => state.logout);

  const items = NAV_ITEMS.filter((item) => !item.private || isAuth);

  return (
    <header className="border-b border-[var(--color-border)]">
      <Container className="flex h-16 items-center justify-between">
        <nav className="flex items-center gap-1">
          {items.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]",
                  isActive && "bg-[var(--color-surface)] text-[var(--color-text)]",
                )
              }
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        {isAuth ? (
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="size-4" aria-hidden />
            Выйти
          </Button>
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center gap-2 text-sm text-[var(--color-primary)]"
          >
            <LogIn className="size-4" aria-hidden />
            Войти
          </Link>
        )}
      </Container>
    </header>
  );
};

export default Header;
