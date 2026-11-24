import { Monitor, Smartphone, Tablet, type LucideIcon } from "lucide-react";
import type { Viewport } from "@/store/editor.store";

/** Адрес превью-страницы (второй entry Vite) */
export const PREVIEW_URL = "/preview.html";

/** Ширина iframe по режиму. Классы целиком, чтобы Tailwind их увидел */
export const VIEWPORTS: { id: Viewport; label: string; icon: LucideIcon; widthClass: string }[] = [
  { id: "desktop", label: "Десктоп", icon: Monitor, widthClass: "w-full" },
  { id: "tablet", label: "Планшет", icon: Tablet, widthClass: "w-[768px]" },
  { id: "mobile", label: "Телефон", icon: Smartphone, widthClass: "w-[375px]" },
];
