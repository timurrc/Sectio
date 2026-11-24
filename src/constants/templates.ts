import type { BlockType, SectionTheme } from "@/types/document.types";

export interface ITemplateSection {
  type: BlockType;
  /** По умолчанию — первый вариант блока */
  variant?: string;
  theme?: SectionTheme;
  /** Поля поверх defaults блока (неглубокое слияние) */
  props?: Record<string, unknown>;
}

export interface ITemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sections: ITemplateSection[];
}

/** Готовые страницы. Тексты подменяют defaults блоков; итог обязан проходить схемы (тест) */
export const TEMPLATES: ITemplate[] = [
  {
    id: "saas",
    name: "SaaS-продукт",
    description: "Полная страница сервиса: от первого экрана до тарифов и вопросов.",
    tags: ["saas", "сервис", "стартап", "продукт", "b2b"],
    sections: [
      { type: "navbar", props: { brand: "Flowdesk" } },
      {
        type: "hero",
        props: {
          eyebrow: "Новое: отчёты в реальном времени",
          title: "Задачи команды в одном спокойном месте",
          subtitle:
            "Flowdesk собирает задачи, сроки и обсуждения, чтобы команда меньше созванивалась и больше делала.",
          ctaLabel: "Попробовать бесплатно",
          secondaryLabel: "Посмотреть демо",
        },
      },
      { type: "logos" },
      { type: "features", props: { title: "Почему команды переходят на Flowdesk" } },
      { type: "testimonials" },
      { type: "pricing" },
      { type: "faq" },
      {
        type: "cta",
        props: { title: "Начните работать спокойнее", ctaLabel: "Создать пространство" },
      },
      { type: "footer", props: { brand: "Flowdesk" } },
    ],
  },
  {
    id: "app",
    name: "Мобильное приложение",
    description: "Тёмный первый экран, список возможностей, отзывы и кнопка загрузки.",
    tags: ["app", "приложение", "мобильное", "ios", "android"],
    sections: [
      { type: "navbar", variant: "centered", theme: "dark", props: { brand: "Habitly" } },
      {
        type: "hero",
        variant: "split",
        theme: "dark",
        props: {
          eyebrow: "Для iOS и Android",
          title: "Полезные привычки без силы воли",
          subtitle:
            "Habitly напоминает в нужный момент и показывает прогресс так, что бросать не хочется.",
          ctaLabel: "Скачать приложение",
          secondaryLabel: "",
        },
      },
      { type: "features", variant: "list", props: { title: "Как это работает" } },
      { type: "testimonials", variant: "large" },
      {
        type: "cta",
        theme: "dark",
        props: { title: "Первая неделя — бесплатно", ctaLabel: "Скачать Habitly" },
      },
      { type: "footer", variant: "minimal", theme: "dark", props: { brand: "Habitly" } },
    ],
  },
  {
    id: "course",
    name: "Курс или мероприятие",
    description: "Программа, форматы участия, ответы на вопросы и запись.",
    tags: ["course", "event", "курс", "мероприятие", "вебинар", "конференция", "обучение"],
    sections: [
      { type: "navbar", props: { brand: "Frontend Camp", ctaLabel: "Записаться" } },
      {
        type: "hero",
        props: {
          eyebrow: "Старт 15 марта · онлайн",
          title: "Восемь недель практики фронтенда",
          subtitle: "Живые разборы кода, проектная работа и ревью от действующих разработчиков.",
          ctaLabel: "Записаться на курс",
          secondaryLabel: "Программа",
        },
      },
      { type: "features", props: { title: "Что вы получите" } },
      { type: "pricing", variant: "table", props: { title: "Форматы участия" } },
      { type: "faq", variant: "columns" },
      {
        type: "cta",
        variant: "simple",
        props: { title: "Места в потоке ограничены", ctaLabel: "Занять место" },
      },
      { type: "footer", variant: "minimal", props: { brand: "Frontend Camp" } },
    ],
  },
];
