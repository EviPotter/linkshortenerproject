# TypeScript Conventions

## Strict Mode

`tsconfig.json` enables `"strict": true`. All code must compile without errors under strict settings.

## Guidelines
For detailed guidelines on specific topic, refer to the modular documentation in the '/docs' directory. ALWAYS refer to the relvant .md file BEFORE generating any code.

## Path Aliases

Use the `@/` alias for all internal imports. Never use relative imports that traverse up more than one directory:

```ts
// ✅
import { db } from "@/db"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ❌ — avoid deep relative paths
import { db } from "../../../db"
```

## File Extensions

- `.ts` — modules with no JSX
- `.tsx` — modules with JSX (components, pages, layouts)

## Component Prop Types

Define prop types inline or as a named interface in the same file. Do not use `React.FC` — declare the function signature directly:

```tsx
// ✅
interface LinkCardProps {
  slug: string
  url: string
  visits: number
}

export default function LinkCard({ slug, url, visits }: LinkCardProps) {
  // …
}

// ❌ — avoid React.FC
const LinkCard: React.FC<LinkCardProps> = ({ slug }) => { … }
```

## Async Server Components

Server Components that fetch data must be `async`:

```tsx
export default async function Page() {
  const data = await fetchSomething()
  return <div>{data}</div>
}
```

## Non-null Assertion

Avoid `!` non-null assertions except at system boundaries (e.g., env variable access in config files):

```ts
// Acceptable at the db config boundary
const db = drizzle(process.env.DATABASE_URL!)

// ❌ — do not use ! in application logic
const value = someMap.get(key)!
```

## Type Imports

Use `import type` for type-only imports to improve tree-shaking and avoid circular dependency issues:

```ts
import type { NextRequest } from "next/server"
import type { Metadata } from "next"
```

## No `any`

Do not use `any`. Use `unknown` with type narrowing, or define a proper type:

```ts
// ✅
function parse(raw: unknown): string {
  if (typeof raw !== "string") throw new Error("Expected string")
  return raw
}

// ❌
function parse(raw: any) { return raw }
```
