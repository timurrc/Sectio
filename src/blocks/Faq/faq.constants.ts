import type { IBlockVariant } from "../defineBlock";
import type { FaqProps } from "./faq.schema";

export const FAQ_TAGS = ["faq", "вопросы", "ответы", "частые вопросы", "аккордеон", "помощь"];

export const FAQ_VARIANTS: IBlockVariant[] = [
  { id: "accordion", name: "Аккордеон" },
  { id: "columns", name: "Две колонки" },
];

export const FAQ_DEFAULTS: FaqProps = {
  title: "Частые вопросы",
  subtitle: "Не нашли ответ — напишите нам, ответим в течение дня.",
  items: [
    {
      question: "Нужно ли уметь программировать?",
      answer:
        "Нет. Страница собирается из готовых секций, тексты и цвета меняются в панели справа.",
    },
    {
      question: "Что я получу при экспорте?",
      answer:
        "Проект на Vite, React и Tailwind: его можно запустить локально или выложить на любой хостинг.",
    },
    {
      question: "Где хранятся мои проекты?",
      answer: "В вашем браузере. Мы ничего не отправляем на сервер.",
    },
  ],
};
