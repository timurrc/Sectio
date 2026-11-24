import { House, User, type LucideIcon } from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Показывать только авторизованным */
  private?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Главная", to: ROUTES.HOME, icon: House },
  { label: "Профиль", to: ROUTES.PROFILE, icon: User, private: true },
];
