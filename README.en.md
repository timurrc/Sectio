<div align="center">

<img src="docs/logo.svg" width="80" alt="Sectio logo" />

# Sectio

A visual landing page builder: assemble a page from sections and export a ready Vite + React + Tailwind project.

[Русский](README.md) · **English**

[Report a bug](../../issues)

![CI](https://img.shields.io/github/actions/workflow/status/timurrc/Sectio/ci.yml?branch=main&label=CI)

<img src="docs/demo.gif" width="800" alt="Building a landing page in Sectio: template, text edit, dark section, drag and drop, ⌘K palette and code" />

</div>

## How it works

A page is a JSON document: a list of sections with their data plus a theme. The block library, drag and drop, the inspector, the ⌘K palette, templates and undo only change that document. The iframe preview, the Code tab and the zip or StackBlitz export only read it, so the code always matches the canvas. Everything is stored in the browser's IndexedDB; there is no backend.

```mermaid
flowchart LR
    U[Library · DnD · inspector · ⌘K · templates] --> S[document.store<br/>undo/redo]
    S --> D[(IDocument)]
    D --> DB[(IndexedDB)]
    D -- postMessage --> P[iframe preview]
    D --> C[Code generation<br/>Babel AST + Prettier]
    C --> Z[Code · zip · StackBlitz]
```

<img src="docs/screenshot.png" width="800" alt="Sectio editor: block library, preview and section properties" />

## Stack

[![Stack](https://skillicons.dev/icons?i=react,ts,vite,tailwind,bun)](https://skillicons.dev)

zustand + immer + zundo · dnd-kit · zod · Babel · Prettier · Monaco · JSZip · StackBlitz SDK · fuse.js · culori · idb-keyval · Vitest · Playwright · axe

## Quick start

```bash
git clone https://github.com/timurrc/Sectio.git && cd Sectio
bun install && cp .env.example .env
bun dev
```

Opens at `http://localhost:5173`. Checks: `bun run check` (lint, format, unit tests, build) and `bun run e2e`.

## Project structure

```
src/
├── blocks/       # block registry: component, zod schema, codegen — one folder per block
├── editor/       # editor logic: storage, preview protocol, DnD, commands, templates
├── codegen/      # builds the exported Vite project
├── preview/      # standalone preview page for the iframe
├── store/        # zustand: document with history, editor state, projects
├── pages/        # projects list and editor, logic in useXxxPage
├── components/   # ui · modules · layouts
├── constants/    # templates, default theme, export dependency versions
├── hooks/        # shared hooks
├── types/        # document model
└── utils/        # pure functions
e2e/              # Playwright scenarios and demo.gif recording (bun run demo)
```

## Author

**Timur Abutalipov** — [GitHub](https://github.com/timurrc)
