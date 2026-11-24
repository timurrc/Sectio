import type { IUser } from "@/types/auth.types";
import type { IFood } from "@/types/food.types";

/** Мок-данные. Отдаются MSW-хендлерами (src/mocks/handlers.ts) и используются в тестах. */
export const MOCK_FOOD: IFood[] = [
  { id: 1, name: "Овсянка", calories: 389, fat: 6.9, protein: 16.9, carbohydrates: 66.3 },
  { id: 2, name: "Куриная грудка", calories: 165, fat: 3.6, protein: 31, carbohydrates: 0 },
  { id: 3, name: "Гречка", calories: 343, fat: 3.4, protein: 13.3, carbohydrates: 71.5 },
  { id: 4, name: "Банан", calories: 89, fat: 0.3, protein: 1.1, carbohydrates: 22.8 },
];

export const MOCK_USER: IUser = { id: 1, name: "Demo", email: "demo@example.com" };

export const MOCK_TOKEN = "mock-access-token";
