import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Склеивает классы и убирает конфликты Tailwind: cn("p-2", isBig && "p-4") → "p-4" */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
