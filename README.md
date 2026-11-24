<div align="center">

<img src="docs/logo.svg" width="80" alt="Sectio logo" />

# Sectio

React-приложение на Vite с типизированным API-слоем, моками и готовым CI.

**Русский** · [English](README.en.md)

[Changelog](CHANGELOG.md) · [Releases](../../releases) · [Сообщить о баге](../../issues)

![CI](https://img.shields.io/github/actions/workflow/status/timurrc/Sectio/ci.yml?branch=main&label=CI)
![Version](https://img.shields.io/github/v/tag/timurrc/Sectio?label=version)

<img src="docs/screenshot.png" width="800" alt="Главный экран Sectio" />

</div>

## Как это работает

Страницы загружаются лениво, данные запрашиваются через TanStack Query и сервисы поверх одного axios-инстанса. В режиме разработки запросы перехватывает MSW, поэтому бэкенд не нужен.

```mermaid
flowchart LR
    P[Page] --> H[usePage hook]
    H --> Q[TanStack Query]
    Q --> S[Service]
    S --> A[axios instance]
    A --> M{VITE_USE_MOCK}
    M -- true --> W[MSW handlers]
    M -- false --> B[(Backend API)]
```

## Стек

[![Stack](https://skillicons.dev/icons?i=react,ts,vite,tailwind,bun)](https://skillicons.dev)

TanStack Query · zustand · react-hook-form · zod · react-router · axios · MSW · Vitest · Playwright

## Быстрый старт

```bash
git clone https://github.com/timurrc/Sectio.git && cd Sectio
bun install && cp .env.example .env
bun dev
```

Откроется на `http://localhost:5173`.

## Структура проекта

```
src/
├── api/          # axios instance
├── services/     # запросы к API
├── hooks/        # общие хуки
├── schemas/      # zod-схемы форм
├── store/        # zustand
├── mocks/        # MSW
├── pages/        # страницы и их хуки
├── components/   # ui · modules · layouts
├── constants/    # env, routes, queryKeys
└── utils/        # чистые функции
```

## Автор

**Timur Abutalipov** — [GitHub](https://github.com/timurrc)
