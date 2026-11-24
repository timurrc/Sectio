import { api } from "@/api/axios.api";
import type { IFood } from "@/types/food.types";

export const FoodService = {
  getAll: async (signal?: AbortSignal) => {
    const { data } = await api.get<IFood[]>("/food", { signal });
    return data;
  },

  getById: async (id: number, signal?: AbortSignal) => {
    const { data } = await api.get<IFood>(`/food/${id}`, { signal });
    return data;
  },
};
