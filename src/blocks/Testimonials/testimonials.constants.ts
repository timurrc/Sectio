import type { IBlockVariant } from "../defineBlock";
import type { TestimonialsProps } from "./testimonials.schema";

export const TESTIMONIALS_TAGS = [
  "testimonials",
  "reviews",
  "отзывы",
  "цитаты",
  "клиенты",
  "мнения",
];

export const TESTIMONIALS_VARIANTS: IBlockVariant[] = [
  { id: "cards", name: "Карточки" },
  { id: "large", name: "Крупные цитаты" },
];

export const TESTIMONIALS_DEFAULTS: TestimonialsProps = {
  title: "Что говорят клиенты",
  subtitle: "Команды запускают страницы быстрее и тратят время на продукт, а не на вёрстку.",
  items: [
    {
      quote: "Собрали лендинг к запуску за вечер, а экспорт сразу отдали разработчикам.",
      author: "Анна Смирнова",
      role: "Продакт-менеджер",
    },
    {
      quote: "Наконец-то код, который не стыдно открыть. Никаких лишних зависимостей.",
      author: "Илья Петров",
      role: "Фронтенд-разработчик",
    },
    {
      quote: "Тёмные секции и своя палитра без единой строчки CSS — то, что нужно.",
      author: "Мария Ким",
      role: "Дизайнер",
    },
  ],
};
