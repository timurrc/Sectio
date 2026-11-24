# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 0.1.0 (2026-11-24)

### Features

- add canvas, viewport switcher and block library to editor ([43a4d5b](https://github.com/timurrc/Sectio/commit/43a4d5b5b86e288374373acfaecb617f9d8cdd32))
- add code tab and export actions to editor ([368bcf6](https://github.com/timurrc/Sectio/commit/368bcf6272946b2831cbf985530e4c4a3f541eab))
- add command palette with fuzzy search ([2fb438b](https://github.com/timurrc/Sectio/commit/2fb438bc89faae88139d8dca3d020355e1a2f0a6))
- add document model and block registry ([e0a0dc8](https://github.com/timurrc/Sectio/commit/e0a0dc89f9a78b1be02e6ac853c0346d4cd41945))
- add document, editor and projects stores ([eb8520f](https://github.com/timurrc/Sectio/commit/eb8520f4044a5f6662e82c3383236a1bfa779633))
- add drag and drop from library to canvas and sortable outline ([84ce5f2](https://github.com/timurrc/Sectio/commit/84ce5f27af7472704daeaa6c7932818a7c3ecaba))
- add editor design tokens, pill buttons and ui primitives ([f04d1f3](https://github.com/timurrc/Sectio/commit/f04d1f3d8c04e3260419624f2ee035c61ef3a2aa))
- add editor foundation (document model, stores, pages) ([112186e](https://github.com/timurrc/Sectio/commit/112186e9ca71be4d81a970960f3303065824cdf9))
- add hero, features, pricing, cta and footer blocks ([e9f55b5](https://github.com/timurrc/Sectio/commit/e9f55b5fb707c821b9b6a833284125b27d204033))
- add navbar, logos, testimonials and faq blocks ([233495a](https://github.com/timurrc/Sectio/commit/233495acecf7c49dedaf2f77e829111175ac20dc))
- add page and theme editor with contrast warnings ([2922bc9](https://github.com/timurrc/Sectio/commit/2922bc9440bfc8e029d38e90b6de9c3e277ad62e))
- add page templates and replace sections action ([6cd0f46](https://github.com/timurrc/Sectio/commit/6cd0f46c43e6b65d16dcd3a4666d59012ce17e4d))
- add preview iframe entry with postMessage protocol and theme css ([e4a2700](https://github.com/timurrc/Sectio/commit/e4a2700b5ec78e28c325c09c9491d18e3f739266))
- add project cards with delete confirmation and empty state ([0b0c32f](https://github.com/timurrc/Sectio/commit/0b0c32f249bbb1ffbb5e385158bb35cbf7316f9c))
- add projects and editor pages with editor layout ([343d75f](https://github.com/timurrc/Sectio/commit/343d75fc29bcc60777e75ea4765512bea9bae3f8))
- add schema-driven section inspector ([d03c462](https://github.com/timurrc/Sectio/commit/d03c462d70e7014697b9c597b428abc66592e07b))
- add textarea, switch and segmented control primitives ([cf54277](https://github.com/timurrc/Sectio/commit/cf542779a2604d28fd18900e4a0b0b139acb2b09))
- build exportable vite project with zip and stackblitz export ([37d7280](https://github.com/timurrc/Sectio/commit/37d728064e8d3c2bdf01a7fde0071598b6524433))
- create projects from templates on projects page ([1284738](https://github.com/timurrc/Sectio/commit/1284738910e8b468ae40f247fa97c728e974f5e4))
- derive inspector fields from block zod schemas ([f6950ce](https://github.com/timurrc/Sectio/commit/f6950ce4d0f8729d5c9f3655fddd5383ac99848c))
- drag sections directly in preview with edge auto-scroll ([a520f5c](https://github.com/timurrc/Sectio/commit/a520f5cdfe95bed5f6aeee03f6850ba94d3d4985))
- generate section code from blocks via babel ast ([b1b9bc9](https://github.com/timurrc/Sectio/commit/b1b9bc94761120c03d15add6000e5be259a7c767))
- group inspector edits in undo history and add section commands ([fdc1f31](https://github.com/timurrc/Sectio/commit/fdc1f319b94148d769fa63e9a6b0ae33649fa775))
- redesign block library with thumbnails and empty states in editor ([8e603e3](https://github.com/timurrc/Sectio/commit/8e603e3250799c4673797a9cca4a8ad988ecccae))
- sync selection, hover, rects and hotkeys between editor and preview ([ab28692](https://github.com/timurrc/Sectio/commit/ab28692fb0b04e918a75527432412b6a26176111))
- wire panels and editor hotkeys into editor page ([a865e3d](https://github.com/timurrc/Sectio/commit/a865e3dd39a4f9493ca42c7eb3d7e690730e2a52))

### Bug Fixes

- allow only safe links in block props ([82a1ee3](https://github.com/timurrc/Sectio/commit/82a1ee319e9bfc15a8505f5d6d6630fd97fe5afe))
- keep long list items inside the inspector panel ([20f749b](https://github.com/timurrc/Sectio/commit/20f749be9df7085ad0b013b41773147697f9ad70))
- keep projects list consistent across tabs and validate stored documents ([ef6443e](https://github.com/timurrc/Sectio/commit/ef6443ea9755023d5fdd183074a1e2c85b9b978d))
- meet wcag contrast and naming in editor chrome ([6cf186e](https://github.com/timurrc/Sectio/commit/6cf186e20ed15271e9f8bba50b76f8c0ccbcca2f))
- show editor states for narrow screens and corrupt projects ([83a64df](https://github.com/timurrc/Sectio/commit/83a64dfbcd6e23e09d061bfa7084b8fe6babf99f))
- stash unsaved document in localStorage when the page unloads ([1ff6a47](https://github.com/timurrc/Sectio/commit/1ff6a47f330a72f5beb29fb553ef87ecdbe1e24b))
