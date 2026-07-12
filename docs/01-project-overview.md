# Project Overview

This is a **link shortener** web application built with a modern full-stack TypeScript setup.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript (strict) | 5.x |
| UI Runtime | React | 19.x |
| Auth | Clerk | 7.x |
| Database | Neon (Postgres serverless) | — |
| ORM | Drizzle ORM | 1.x RC |
| Styling | Tailwind CSS | 4.x |
| Component Library | shadcn/ui (`base-nova` style) | 4.x |
| UI Primitives | Base UI (`@base-ui/react`) | 1.x |
| Icons | Lucide React | — |

## Key Constraints

- **Next.js 16 has breaking changes** vs earlier versions. Always read `node_modules/next/dist/docs/` before using any Next.js API. Do not rely on training-data assumptions.
- **React 19** is in use. Avoid patterns deprecated in React 19 (e.g., legacy context, `forwardRef` as a prop).
- **Clerk v7** has a different API surface than Clerk v4/v5. Do not guess Clerk imports — verify against the installed package.
- **Drizzle ORM 1.x RC** may differ from the stable 0.x API.
- **Tailwind v4** uses a CSS-first config approach — there is no `tailwind.config.js`. All theme customisation is done in `app/globals.css`.

## Path Aliases

The `@/` alias maps to the **project root**:

```ts
import { db } from "@/db"          // → db/index.ts
import { cn } from "@/lib/utils"   // → lib/utils.ts
import { Button } from "@/components/ui/button"
```

## Environment Variables

All secrets must be stored in `.env.local` (never committed). The required variables are:

```
DATABASE_URL=          # Neon postgres connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
