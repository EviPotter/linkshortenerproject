# Styling Conventions (Tailwind v4 + shadcn/ui + Base UI)

## Tailwind CSS v4

This project uses **Tailwind CSS v4**, which is configured entirely in CSS — there is **no `tailwind.config.js`**. All theme tokens (colors, spacing, fonts, etc.) and custom utilities are defined in `app/globals.css`.

```css
/* app/globals.css — theme customisation goes here */
@import "tailwindcss";

@theme {
  --color-brand: oklch(65% 0.2 250);
  /* … */
}
```

### Key Differences from Tailwind v3

- No JavaScript config file — use `@theme {}` in CSS.
- CSS variables are first-class; all design tokens are CSS custom properties.
- The PostCSS plugin is `@tailwindcss/postcss`.

## Class Name Utility

Use the `cn()` helper from `@/lib/utils` to merge Tailwind classes conditionally. Never concatenate class strings manually:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", isActive && "active-class", className)} />
```

## UI Component Rule

> **All UI elements must use shadcn/ui components. Never build custom UI components from scratch.**

This project enforces a single UI component system:

- **Always reach for a shadcn/ui component first.** If a suitable component exists, use it.
- **Never create custom component files** for UI elements (buttons, inputs, dialogs, badges, cards, etc.).
- If a required component is not yet installed, **add it via the CLI** (see below) rather than hand-rolling it.
- If a shadcn/ui component needs minor visual tweaks, **pass `className` props** to override styles — do not duplicate or fork the component.

## shadcn/ui

Components are added via the `shadcn` CLI and live in `components/ui/`. The configuration in `components.json` specifies:

- Style: `base-nova`
- Base color: `neutral`
- CSS variables: `true`
- Icon library: `lucide`

### Adding Components

```bash
npx shadcn@latest add <component-name>
```

**Do not manually create files in `components/ui/`** — always use the CLI so the component is generated with the correct style variant and Base UI primitives.

### Existing Components

| Component | Import |
|---|---|
| Button | `@/components/ui/button` |

## Base UI Primitives (`@base-ui/react`)

shadcn/ui in `base-nova` style is built on top of **Base UI** (`@base-ui/react`) rather than Radix UI. When modifying or extending a UI component, use `@base-ui/react` primitives directly:

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Dialog } from "@base-ui/react/dialog"
```

Do not install or use Radix UI packages — they are not part of this stack.

## Icons

Import icons from `lucide-react`:

```tsx
import { Link, Copy, Trash2, ExternalLink } from "lucide-react"
```

SVG icons automatically inherit the `size-4` class from the Button component when placed inside a `<Button>`.

## Button Variants

The `Button` component supports the following variants and sizes:

| Variant | Usage |
|---|---|
| `default` | Primary action |
| `outline` | Secondary action |
| `secondary` | Tertiary / less prominent |
| `ghost` | Minimal, icon-only contexts |
| `destructive` | Delete / irreversible actions |
| `link` | Inline text links |

| Size | Usage |
|---|---|
| `default` | Standard (h-8) |
| `sm` | Compact forms |
| `lg` | Prominent CTAs |
| `xs` | Dense UI |
| `icon` | Square icon buttons (h-8 w-8) |
| `icon-xs` | Small square icon buttons |

## Dark Mode

The app supports dark mode via CSS `dark:` variants. Use `dark:` prefixed classes alongside light-mode classes:

```tsx
<div className="bg-white dark:bg-zinc-900 text-black dark:text-white" />
```

## Animation

The `tw-animate-css` package provides animation utilities. Use its classes for simple enter/exit animations rather than writing custom keyframes.

## Responsive Design

Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) for adaptive layouts. Default styles are mobile-first.
