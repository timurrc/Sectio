# Project name

Шаблон фронтенда. Пакетный менеджер — **bun**.

| Задача               | Инструмент                                                          |
| -------------------- | ------------------------------------------------------------------- |
| Сборка               | Vite + React 19 + TypeScript, алиас `@/` → `src/`                   |
| Стили                | Tailwind v4 (классы прямо в разметке, цвета — CSS-переменные)       |
| Роутинг              | react-router-dom, lazy-страницы, защищённые роуты                   |
| Запросы              | axios (instance) + services + TanStack Query (+ Devtools)           |
| Формы                | react-hook-form + zod                                               |
| Env                  | проверка `.env` через zod при старте                                |
| Моки                 | MSW — одни хендлеры для браузера и тестов                           |
| Глобальное состояние | zustand (токен, пользователь и т.п.)                                |
| Ошибки               | react-error-boundary — экран ошибки вместо белой страницы           |
| Иконки / уведомления | lucide-react / sonner                                               |
| Качество             | ESLint, Prettier + prettier-plugin-tailwindcss, husky + lint-staged |
| Тесты                | Vitest + Testing Library + MSW, Playwright (e2e)                    |

## Создание проекта

```bash
bun create vite . --template react-ts --eslint --no-interactive && bun install
```

Флаг `--eslint` обязателен: без него create-vite ставит Oxlint.

### Зависимости

```bash
bun add axios react-router-dom @tanstack/react-query @tanstack/react-query-devtools zustand react-hook-form zod @hookform/resolvers react-error-boundary clsx tailwind-merge lucide-react sonner
bun add -d tailwindcss @tailwindcss/vite prettier prettier-plugin-tailwindcss vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test msw husky lint-staged
bunx msw init public --save
bunx playwright install chromium
git init && bunx husky   # husky работает только в git-репозитории
```

Tailwind v4 подключается без `tailwind.config.js` и `postcss.config.js`:

- `vite.config.ts` → `plugins: [react(), tailwindcss()]`
- `src/index.css` → `@import "tailwindcss";` + токены в `@theme static { ... }`

Алиас `@/` — в двух местах: `resolve.alias` в `vite.config.ts` и `paths` в `tsconfig.app.json`.

### Переменные окружения

`cp .env.example .env`. Проверяются схемой в `src/constants/env.ts` — при ошибке приложение не стартует и пишет, какая переменная неверна.

```
VITE_API_URL=https://api.example.com
VITE_USE_MOCK=true   # запросы перехватывает MSW, бэкенд не нужен
```

`.env.test` — значения для Vitest (коммитится).

## Команды

| Команда                     | Что делает                                                       |
| --------------------------- | ---------------------------------------------------------------- |
| `bun run dev`               | Dev-сервер                                                       |
| `bun run typecheck`         | Проверка типов                                                   |
| `bun run lint`              | ESLint                                                           |
| `bun run format`            | Prettier (сортирует и классы Tailwind)                           |
| `bun run test` / `test:run` | Vitest в watch-режиме / один прогон                              |
| `bun run e2e`               | Playwright                                                       |
| `bun run build`             | Типы + production-сборка                                         |
| `bun run check`             | lint + format:check + test:run + build — **перед сдачей задачи** |

Перед каждым коммитом husky запускает lint-staged: ESLint `--fix` и Prettier только по изменённым файлам.

## Структура `src`

```
src/
  api/          axios.api.ts — только instance и interceptors, без эндпоинтов
  services/     *.service.ts — функции по эндпоинтам (getAll, getById, create…)
  hooks/        общие хуки (TanStack Query, useDebounce)
  schemas/      *.schema.ts — zod-схемы форм
  types/        *.types.ts, env.d.ts — интерфейсы (DTO форм выводятся из схем)
  utils/        cn.ts, formatPrice.ts — чистые функции без React
  constants/    env.ts, routes.ts, navigation.ts, queryKeys.ts, mock.ts
  store/        *.store.ts — zustand
  mocks/        handlers.ts, browser.ts, server.ts — MSW
  pages/        страницы + их хуки (LoginPage/LoginPage.tsx + LoginPage/useLoginPage.ts)
  components/
    ui/         базовые элементы (Button, Input, ErrorFallback, PageLoader)
    modules/    блоки с бизнес-логикой (Header, FoodCard)
    layouts/    каркас: Container, MainLayout, ProtectedRoute
  test/         setup.ts, renderWithProviders.tsx
e2e/            сценарии Playwright
```

### Поток данных

```
pages/Page.tsx → pages/usePage.ts → hooks (useQuery/useMutation) → services → api (axios instance)
      ↓                                                                         ↕
components/modules → components/ui                                    mocks (MSW, если USE_MOCK)
```

## Правила

### Импорты

- Между папками — через алиас: `import Button from "@/components/ui/Button/Button"`.
- Внутри одной папки — относительно: `import { useLoginPage } from "./useLoginPage"`.

### Клиент-сервер

- `api/axios.api.ts` — instance: `baseURL` из `ENV`, токен из zustand, refresh на 401, ошибки → `ApiError`.
- Эндпоинты живут только в `services/*.service.ts`, каждый метод типизирован: `api.get<IFood[]>(...)`.
- Компоненты не вызывают `api`/`axios` напрямую — только через хуки TanStack Query.
- Переменные окружения — только через `ENV` из `constants/env.ts`, не `import.meta.env`.

### Моки (MSW)

- Сервисы не знают про моки. Новый эндпоинт в `services` → хендлер в `mocks/handlers.ts`.
- Данные для хендлеров — в `constants/mock.ts`.
- В браузере MSW включается при `VITE_USE_MOCK=true`; в Vitest работает всегда (`onUnhandledFrame: "error"` — незамоканный запрос валит тест).
- Переопределить ответ в конкретном тесте: `server.use(http.get(...))`.

### Формы

- Схема — `schemas/xxx.schema.ts` (zod), тип формы — `z.infer<typeof schema>` в `types/`.
- `useForm({ resolver: zodResolver(schema) })` — в хуке страницы, не в компоненте.
- Ошибки полей с бэкенда (`ApiError.fieldErrors`) → `form.setError(...)`.
- UI-инпуты принимают `{...register("field")}`: `ComponentProps<"input">` включает `ref` (React 19).

### Константы

- Пути — `constants/routes.ts` (`ROUTES.HOME`), никаких строк `"/profile"` в коде.
- Меню — `constants/navigation.ts` (`NAV_ITEMS` с иконками lucide).
- Ключи запросов — `constants/queryKeys.ts`. Мок-данные — `constants/mock.ts`.

### Страницы и логика

- Страница только рисует. Состояние, форма, запросы, обработчики — в хуке рядом: `pages/LoginPage/useLoginPage.ts`.
- Хук, нужный нескольким страницам, переезжает в `src/hooks/`.
- Страницы подключаются в `App.tsx` через `lazy(() => import(...))`. `Suspense` и `ErrorBoundary` уже стоят в `MainLayout`.

### Состояние

- Серверные данные — TanStack Query (не копировать их в zustand). Смотреть кэш — Devtools (кнопка внизу слева в dev).
- Глобальное клиентское состояние (токен, пользователь, тема, корзина) — zustand в `store/`.
- В компонентах читать стор через селектор: `useAuthStore((s) => s.user)`.

### Ошибки

- Падение страницы ловит `ErrorBoundary` в `MainLayout` (Header остаётся, сброс при смене роута).
- Падение всего приложения — `ErrorBoundary` в `main.tsx`.
- Ошибки запросов — `error` из useQuery / `toast.error` в `onError` мутации.

### Стили

- Только Tailwind-классы прямо в разметке. SCSS / CSS Modules / inline `style` не используем.
- Цвета — переменные в `@theme static` в `src/index.css`, в разметке: `text-[var(--color-text)]`, `bg-[var(--color-primary)]`. Хекс-цвета в классах не пишем.
- Условные классы и проп `className` — через `cn()`.
- Контент страниц всегда внутри `Container`. `MainLayout` уже оборачивает `<Outlet />`; секции на всю ширину (Header, баннеры) — `Container` внутри них.

### Иконки и уведомления

- Иконки — `lucide-react`: `<Search className="size-4" aria-hidden />`.
- Уведомления — `toast.success()` / `toast.error()` из `sonner`, `<Toaster />` уже в `main.tsx`.

### Защищённые роуты

- `<Route element={<ProtectedRoute />}>` — только для авторизованных, иначе `/login` с возвратом обратно (`state.from`).
- `<Route element={<ProtectedRoute mode="guest" />}>` — только для гостей; после входа сам уводит на `state.from`.

## Что класть в `components`

### `components/ui` — базовые элементы

Button, Input, Textarea, Select, Checkbox, Modal, Tooltip, Spinner, PageLoader, ErrorFallback, Badge, Skeleton.

- «Глупые»: всё через props, своих данных нет.
- Не импортируют `modules`, `services`, `store`, хуки с API.
- Не знают предметную область: нет `Food`, `User`, `Cart` в названиях и props.
- Props: `extends ComponentProps<"button">` (включая `ref`), принимают `className`, пробрасывают `...props`.
- Варианты — props + объект классов: `variant="primary" | "outline"`, `size="sm" | "md"`.

### `components/modules` — блоки с бизнес-логикой

Header, Footer, FoodCard, FoodList, CartWidget, SearchBar, Filters.

- Собраны из `ui`, знают про типы из `types/`, могут читать стор и вызывать хуки.
- Не задают раскладку страницы (ширина, внешние отступы) — это `layouts` и `pages`.

### `components/layouts` — каркас

Container, MainLayout, AuthLayout, ProtectedRoute, Grid, Section.

- Раскладка: ширина, отступы, сетка, общая обёртка для группы роутов (`<Outlet />`).
- Своих данных не загружают.

### `pages` — страницы

- Одна страница = один роут = папка `pages/XxxPage/` с `XxxPage.tsx` и, если есть логика, `useXxxPage.ts`.
- Собирают `modules` и `ui`, минимум собственной разметки.

### Правило зависимостей

```
pages → modules → ui
  ↓        ↓
layouts   hooks → services → api
```

Импорт идёт только вниз: `ui` не импортирует `modules`, `modules` не импортирует `pages`.

### Именование

- Компонент: `ui/Button/Button.tsx`, `export default Button`, тест рядом — `Button.test.tsx`.
- Сервис: `food.service.ts` → `export const FoodService`.
- Схема: `auth.schema.ts` → `export const loginSchema`.
- Типы: `food.types.ts` → `export interface IFood`; DTO — `ILoginDto`.
- Стор: `auth.store.ts` → `export const useAuthStore`.
- Хуки: `useXxx.ts`. Константы: `UPPER_CASE`.

## Тесты

- Vitest + Testing Library: `utils`, хуки, `ui`, роутинг, страницы с формами. Файл рядом с кодом: `*.test.ts(x)`.
- Компоненты с роутером/запросами — через `renderWithProviders` из `src/test` (`route` принимает и `{ pathname, state }`).
- Запросы в тестах идут через настоящий axios и перехватываются MSW — сервисы не мокаем через `vi.mock`.
- Playwright: ключевые пользовательские сценарии в `e2e/` (работают на моках).
