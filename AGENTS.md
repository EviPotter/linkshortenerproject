<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Instructions

> [!IMPORTANT]
> **You MUST read the relevant `/docs` file(s) before generating ANY code.** This is non-negotiable. Do not write, suggest, or modify code until you have read every doc file that applies to the task. Skipping this step will result in incorrect, non-compliant code that violates project conventions.

All coding standards and conventions for this project are documented in the `/docs` directory. **Always use the `read_file` tool to read each relevant doc before writing any code.**

| File | Topic |
|---|---|
| [docs/01-project-overview.md](docs/01-project-overview.md) | Tech stack, path aliases, environment variables |
| [docs/02-nextjs.md](docs/02-nextjs.md) | Next.js 16 App Router, Server/Client Components, Route Handlers, caching |
| [docs/03-typescript.md](docs/03-typescript.md) | TypeScript strict mode, prop types, imports |
| [docs/04-database.md](docs/04-database.md) | Drizzle ORM schema, queries, migrations, security |
| [docs/05-auth.md](docs/05-auth.md) | Clerk v7 middleware, server-side auth, client hooks, UI components |
| [docs/06-styling.md](docs/06-styling.md) | Tailwind v4, shadcn/ui (base-nova), Base UI primitives, icons |
| [docs/07-file-structure.md](docs/07-file-structure.md) | Folder layout, naming conventions, co-location rules |

## Quick Rules

- **Always `await params`** in dynamic route pages and route handlers (Next.js 15+ breaking change).
- **Always `await cookies()` and `await headers()`** — they are async in this version.
- **Import `useRouter` from `next/navigation`**, not `next/router`.
- **Clerk is the only auth method.** No other authentication libraries or custom session logic.
- **Always verify `userId` server-side** via `auth()` from `@clerk/nextjs/server` before any DB query.
- **`/dashboard` is protected** — never add it to the public routes matcher in `proxy.ts`.
- **Sign-in/sign-up are always modals** — use `<SignInButton mode="modal">` / `<SignUpButton mode="modal">`, never link to `/sign-in` or `/sign-up` directly.
- **Authenticated users on `/` redirect to `/dashboard`** via middleware.
- **Never use Radix UI** — this project uses `@base-ui/react` primitives.
- **No `tailwind.config.js`** — Tailwind v4 is configured in `app/globals.css` via `@theme {}`.
- **Add shadcn components via CLI only**: `npx shadcn@latest add <component>`.
- **All UI elements use shadcn/ui — never create custom UI components.** If a component exists in shadcn/ui, use it. If it doesn't exist yet, add it via the CLI.
