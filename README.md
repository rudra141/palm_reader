# Praxa

A premium AI palm-reading web app rooted in **two authentic traditions** — Indian (Hasta Sāmudrika Śāstra) and Chinese (Mian Xiang). Source-grounded readings, master-practitioner voice, no theatre.

> Working brand name; pending TM clearance. See `/docs/decisions.md`.

## Status

In active development. Phase 2 — Foundation. See `/docs/progress.md` for the live tracker and `/docs/workflow.md` for the 14-phase plan.

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

## Scripts

| Command          | What it does                                            |
| ---------------- | ------------------------------------------------------- |
| `pnpm dev`       | Next.js dev server                                      |
| `pnpm build`     | Production build                                        |
| `pnpm start`     | Run production build locally                            |
| `pnpm typecheck` | `tsc --noEmit`                                          |
| `pnpm lint`      | ESLint                                                  |
| `pnpm test`      | Vitest unit tests                                       |
| `pnpm test:e2e`  | Playwright E2E tests                                    |
| `pnpm eval`      | Run the AI eval harness against `/evals/golden/` (CP3+) |
| `pnpm format`    | Prettier                                                |
| `pnpm analyze`   | Bundle analyzer                                         |

## Where everything lives

```
/app                  Next.js App Router (RSC by default)
/components/ui        Design-system primitives
/components/sections  Composed page sections
/components/3d        R3F + GSAP scroll story
/lib                  Pure utilities (no React)
  /ai                 AI client + prompt registry
  /vision             Vision-pipeline helpers
  /validation         Zod schemas
/hooks                React hooks
/content/<locale>     i18n content
/evals                AI eval harness + golden test cases
/docs                 Project specifications (read-only without permission)
/.claude              Claude Code config (slash commands + agents + hooks)
```

## Reference docs

| Doc                      | What it is                                                                   |
| ------------------------ | ---------------------------------------------------------------------------- |
| `/docs/brief.md`         | Synthesis of the original idea                                               |
| `/docs/prd.md`           | Product spec — features, personas, page inventory                            |
| `/docs/trd.md`           | Technical spec — stack, architecture, AI infrastructure, performance budgets |
| `/docs/ai-spec.md`       | **AI behavior contract** — what the AI must / must never say                 |
| `/docs/research.md`      | Cited research base — Indian + Chinese palmistry primary sources             |
| `/docs/prompts.md`       | Versioned prompt library                                                     |
| `/docs/sitemap.md`       | URL tree + per-page metadata                                                 |
| `/docs/content-plan.md`  | Per-page copy drafts                                                         |
| `/docs/design-system.md` | Tokens, components, motion principles                                        |
| `/docs/scroll-story.md`  | 3D narrative beat-by-beat                                                    |
| `/docs/risk-register.md` | Top 14 risks + mitigations                                                   |
| `/docs/decisions.md`     | Every meaningful decision with rationale                                     |
| `/docs/workflow.md`      | 14-phase autonomous build workflow                                           |
| `/CLAUDE.md`             | Operational rules for the Claude Code agent                                  |

Don't modify the locked specs (PRD, TRD, AI spec, design system) after CP1 without explicit approval — they're the contract.

## License

Proprietary. All rights reserved.
