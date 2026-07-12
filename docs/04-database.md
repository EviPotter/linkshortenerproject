# Database Conventions (Drizzle ORM + Neon)

## Setup

The database client is exported from `db/index.ts`:

```ts
import { drizzle } from "drizzle-orm/neon-http"
const db = drizzle(process.env.DATABASE_URL!)
export { db }
```

Import `db` from `@/db`:

```ts
import { db } from "@/db"
```

## Schema

All table definitions live in `db/schema.ts`. Export each table as a named constant.

```ts
// db/schema.ts
import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core"

export const linksTable = pgTable("links", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull(),
  slug: text().notNull().unique(),
  url: text().notNull(),
  visits: integer().notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
```

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Table constant | `camelCase` + `Table` suffix | `linksTable` |
| Table name (SQL) | `snake_case` | `"links"` |
| Column names (TS) | `camelCase` | `userId` |
| Column names (SQL) | `snake_case` string | `"user_id"` |

## Queries

Run queries inside Server Components, Server Functions, or Route Handlers — never in Client Components.

```ts
import { db } from "@/db"
import { linksTable } from "@/db/schema"
import { eq } from "drizzle-orm"

// Select
const links = await db
  .select()
  .from(linksTable)
  .where(eq(linksTable.userId, userId))

// Insert
await db.insert(linksTable).values({ userId, slug, url })

// Update
await db
  .update(linksTable)
  .set({ visits: sql`${linksTable.visits} + 1` })
  .where(eq(linksTable.slug, slug))

// Delete
await db.delete(linksTable).where(eq(linksTable.id, id))
```

## Migrations

Migrations are managed by Drizzle Kit. Config is in `drizzle.config.ts`. Generated migration files go into the `drizzle/` directory.

```bash
# Generate a migration after schema changes
npx drizzle-kit generate

# Push schema directly to the database (dev only)
npx drizzle-kit push
```

**Never edit generated migration files manually.**

## Security

- Always filter queries by `userId` (from Clerk) to enforce row-level ownership.
- Never expose raw database errors to the client.
- Validate and sanitise all user-supplied values before inserting or updating.

```ts
// ✅ Always scope queries to the authenticated user
const { userId } = await auth()
if (!userId) throw new Error("Unauthorized")

const links = await db
  .select()
  .from(linksTable)
  .where(eq(linksTable.userId, userId))
```
