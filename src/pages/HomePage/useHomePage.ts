import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useFoodList } from "@/hooks/useFood";

/** Вся логика HomePage: данные, поиск, фильтрация. Компонент страницы только рисует. */
export const useHomePage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { data = [], isPending, error } = useFoodList();

  const foods = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return query ? data.filter((food) => food.name.toLowerCase().includes(query)) : data;
  }, [data, debouncedSearch]);

  return { search, setSearch, foods, isPending, error };
};
