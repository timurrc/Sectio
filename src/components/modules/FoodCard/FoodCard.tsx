import type { IFood } from "@/types/food.types";

interface FoodCardProps {
  food: IFood;
}

const FoodCard = ({ food }: FoodCardProps) => {
  return (
    <article className="rounded-xl border border-[var(--color-border)] p-4">
      <h3 className="mb-2 font-medium">{food.name}</h3>
      <p className="text-sm text-[var(--color-muted)]">
        {food.calories} ккал · Б {food.protein} · Ж {food.fat} · У {food.carbohydrates}
      </p>
    </article>
  );
};

export default FoodCard;
