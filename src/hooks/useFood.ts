import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/api/axios.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { FoodService } from "@/services/food.service";
import type { IFood } from "@/types/food.types";

export const useFoodList = () =>
  useQuery<IFood[], ApiError>({
    queryKey: QUERY_KEYS.food.all,
    queryFn: ({ signal }) => FoodService.getAll(signal),
  });

export const useFood = (id: number) =>
  useQuery<IFood, ApiError>({
    queryKey: QUERY_KEYS.food.byId(id),
    queryFn: ({ signal }) => FoodService.getById(id, signal),
    enabled: Number.isFinite(id),
  });
