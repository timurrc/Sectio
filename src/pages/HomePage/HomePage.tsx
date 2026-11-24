import { Search } from "lucide-react";
import FoodCard from "@/components/modules/FoodCard/FoodCard";
import Input from "@/components/ui/Input/Input";
import { useHomePage } from "./useHomePage";

const HomePage = () => {
  const { search, setSearch, foods, isPending, error } = useHomePage();

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-4xl font-medium">Продукты</h1>

      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-muted)]"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск"
          aria-label="Поиск"
          className="pl-9"
        />
      </div>

      {isPending && <p className="text-[var(--color-muted)]">Загрузка…</p>}
      {error && <p className="text-[var(--color-danger)]">{error.message}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </section>
  );
};

export default HomePage;
