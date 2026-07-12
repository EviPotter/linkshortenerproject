# Authentication Conventions (Clerk v7)

> **Critical:** This project uses `@clerk/nextjs` v7. The API surface differs significantly from v4/v5. Do not use Clerk patterns from older training data without verifying them against the installed package.

## Auth Rules

- **Clerk is the only auth method.** Do not implement any other authentication system (JWT, NextAuth, custom sessions, etc.).
- **`/dashboard` is a protected route.** It must require an authenticated user. Unauthenticated users are redirected to sign-in automatically via middleware.
- **Authenticated users visiting `/` are redirected to `/dashboard`.**
- **Sign-in and sign-up always launch as a modal.** Never navigate to a dedicated sign-in/sign-up page from within the app UI.

## Middleware

Authentication is enforced in `proxy.ts` (the middleware file) using `clerkMiddleware` and `createRouteMatcher`.

`/dashboard` must **not** appear in the public routes list — it is protected by default because the middleware calls `auth.protect()` on all non-public routes.

Authenticated users hitting `/` must be redirected to `/dashboard` inside the middleware:

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/:slug",     // short-link redirect endpoint
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const { pathname } = new URL(request.url)

  // Redirect authenticated users away from the homepage
  if (userId && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})
```

The middleware matcher also includes `/__clerk/:path*` to support Clerk's hosted UI proxy.

## Public Routes

Routes that do **not** require authentication must be added to the `isPublicRoute` matcher. `/dashboard` must never be added here.

## Server-Side Auth

Use the async `auth()` helper from `@clerk/nextjs/server` in Server Components, Server Functions, and Route Handlers:

```ts
import { auth } from "@clerk/nextjs/server"

export async function myServerFunction() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  // …
}
```

## Client-Side Auth State

Use Clerk's React hooks in Client Components:

```tsx
'use client'

import { useUser, useAuth } from "@clerk/nextjs"

export function ProfileButton() {
  const { user, isLoaded } = useUser()
  if (!isLoaded) return null
  return <span>{user?.firstName}</span>
}
```

## Conditional UI Rendering

Use Clerk's `<Show>` component (from `@clerk/nextjs`) to conditionally render based on auth state — as established in `app/layout.tsx`:

```tsx
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"

<Show when="signed-out">
  <SignInButton />
  <SignUpButton />
</Show>

<Show when="signed-in">
  <UserButton />
</Show>
```

## Sign-In / Sign-Up — Modal Only

Sign-in and sign-up must always open as a **modal**. Never link to `/sign-in` or `/sign-up` directly from the app UI.

Use `mode="modal"` on all `<SignInButton>` and `<SignUpButton>` components:

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs"

<SignInButton mode="modal">
  <button>Sign in</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Sign up</button>
</SignUpButton>
```

The `app/sign-in/[[...sign-in]]/` and `app/sign-up/[[...sign-up]]/` routes exist as required fallbacks for Clerk's redirect flow but are not linked to from within the app UI.

## Clerk UI Theme

The app uses Clerk's `shadcn` theme from `@clerk/ui/themes` to match the design system:

```tsx
import { shadcn } from "@clerk/ui/themes"

<ClerkProvider appearance={{ theme: shadcn }}>
```

## Security Rules

- Always call `auth()` or `auth.protect()` server-side before accessing any user data.
- Never trust a `userId` sent from the client — always derive it from the server-side `auth()` call.
- Every Server Function that touches user data must verify auth before touching the database.
