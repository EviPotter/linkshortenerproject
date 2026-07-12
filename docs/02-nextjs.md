# Next.js 16 Conventions

> **Critical:** Next.js 16 contains breaking changes. When in doubt, read the source docs at `node_modules/next/dist/docs/` rather than relying on prior knowledge.

## App Router Only

This project uses the **App Router** exclusively. Do not use `pages/` directory patterns.

## File Conventions

| File | Purpose |
|---|---|
| `app/layout.tsx` | Root or nested layout (wraps `children`) |
| `app/page.tsx` | Page component for a route segment |
| `app/loading.tsx` | Suspense loading UI for a segment |
| `app/error.tsx` | Error boundary for a segment |
| `app/not-found.tsx` | 404 UI for a segment |
| `app/route.ts` | Route Handler (API endpoint) |

## Dynamic Routes

Dynamic segments use folder names in brackets:

```
app/[slug]/page.tsx          → /anything
app/[...slug]/page.tsx       → /a/b/c (catch-all)
app/[[...slug]]/page.tsx     → / or /a/b/c (optional catch-all)
```

Params are a **Promise** in Next.js 15+. Always `await` them:

```tsx
// ✅ Correct
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
}

// ❌ Wrong — params is not synchronous
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params.slug
}
```

## Server vs Client Components

**Server Components are the default.** Only add `'use client'` when necessary.

Use **Client Components** (`'use client'`) for:
- `useState`, `useReducer`, `useEffect`, and other React hooks
- Event handlers (`onClick`, `onChange`, etc.)
- Browser-only APIs (`localStorage`, `window`, etc.)
- Custom hooks

Use **Server Components** for:
- Database queries (Drizzle)
- Reading environment variables / secrets
- Anything that should not run in the browser

```tsx
// Server Component (default — no directive needed)
import { db } from "@/db"

export default async function Page() {
  const links = await db.select().from(links)
  return <ul>{links.map(l => <li key={l.id}>{l.slug}</li>)}</ul>
}
```

```tsx
// Client Component
'use client'

import { useState } from "react"

export default function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  // ...
}
```

## Server Functions (Server Actions)

Mutations use **Server Functions** with the `'use server'` directive. Always authenticate inside them.

```ts
// app/lib/actions.ts
'use server'

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { linksTable } from "@/db/schema"

export async function createLink(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const url = formData.get("url") as string
  // validate, insert, revalidate…
}
```

## Route Handlers

API endpoints live in `app/api/**/route.ts`. Use the Web `Response` / `Request` APIs:

```ts
// app/api/[slug]/route.ts
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  // …
  return Response.json({ slug })
}
```

## Async Headers and Cookies

`headers()` and `cookies()` are **async** in Next.js 15+:

```ts
import { cookies } from "next/headers"
import { headers } from "next/headers"

const cookieStore = await cookies()
const headersList = await headers()
```

## Navigation

- Always import `useRouter` from `next/navigation` (not `next/router`).
- Use `<Link>` from `next/link` for client-side navigation.
- Use `redirect()` from `next/navigation` for server-side redirects.

```ts
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"
```

## Caching

- **Cache Components** (`use cache` directive) are opt-in via `cacheComponents: true` in `next.config.ts`.
- This project does **not** currently enable `cacheComponents`. Use `fetch` with standard caching options or Drizzle queries directly.
- `revalidatePath()` and `revalidateTag()` are available for on-demand revalidation after mutations.

## Deprecated / Removed in v16

- `export const dynamic = ...` and `export const revalidate = ...` route segment config are **removed** when `cacheComponents` is enabled.
- `export const experimental_ppr = true` is removed.
- `runtime = "experimental-edge"` is removed; use `"edge"`.
