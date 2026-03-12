> ⚠️ AGENT: Read this entire file before touching any code in this project.

# Odda Store - Agent Skills & Project Rules

## 1. Project Overview
- Brand: `Odda | Premium Dental Tools`.
- App type: small Next.js App Router storefront.
- Public routes: home, product listing, product details, custom 404.
- Planned backend: Next.js API Routes (`src/app/api/`) as the server layer, MongoDB as the database, and Cloudinary for image hosting and delivery.
- Current state: all data is still hardcoded. Do NOT begin migrating any screen to real data fetching until the API layer is scaffolded and agreed upon.
- Global chrome is mounted in the root layout on every page: `AnnouncementBar`, `Navbar`, `Footer`, `CartDrawer`, `SearchModal`.

## 2. Tech Stack & Versions
- Next.js `16.1.6`
- React `19.2.3`
- React DOM `19.2.3`
- TypeScript `^5` with `strict: true`
- Tailwind CSS `^4`
- `@tailwindcss/postcss` `^4`
- Zustand `^5.0.11`
- Framer Motion `^12.35.2`
- Swiper `^12.1.2`
- Embla Carousel React `^8.6.0`
- Swiper (`swiper/react`) is the active carousel library. Use it for all sliders and carousels.
- Embla Carousel (`embla-carousel-react`) is installed as a shadcn dependency but is not actively used in the storefront. Do not use Embla directly.
- Radix UI via `radix-ui` `^1.4.3`
- shadcn CLI config `^4.0.5` with `style: "radix-vega"`
- Lucide React `^0.577.0`
- `tw-animate-css` `^1.4.0`
- `class-variance-authority` `^0.7.1`
- No `tailwind.config.ts` exists in this repo.
- Remote image allowlist in `next.config.ts`: `https://lh3.googleusercontent.com/**`

## 3. Project Structure (actual file tree)
Project-owned files below. Generated `.next/` output and `node_modules/` are intentionally omitted.

- `refactor.js` is a one-off migration script used during initial setup. Do not modify, delete, or re-run it. It is not part of the application runtime.

```text
odda-web/
  .gitignore
  components.json
  eslint.config.mjs
  next-env.d.ts
  next.config.ts
  package-lock.json
  package.json
  postcss.config.mjs
  README.md
  refactor.js
  tsconfig.json
  public/
    file.svg
    globe.svg
    logo.png
    next.svg
    vercel.svg
    window.svg
  stitch-designs/
    cart.html
    details.html
    home.html
    listing.html
  src/
    app/
      favicon.ico
      globals.css
      layout.tsx
      not-found.tsx
      page.tsx
      product/
        [id]/
          page.tsx
      products/
        page.tsx
    components/
      cart/
        CartDrawer.tsx
      layout/
        AnnouncementBar.tsx
        Footer.tsx
        Navbar.tsx
      search/
        SearchModal.tsx
      ui/
        accordion.tsx
        badge.tsx
        button.tsx
        carousel.tsx
        input.tsx
        label.tsx
        separator.tsx
        sheet.tsx
        slider.tsx
        tabs.tsx
    lib/
      utils.ts
    store/
      useCartUIStore.ts
      useSearchUIStore.ts
```

## 4. Design System
### CSS variables (list every `--var` from `globals.css` with its actual value)
Exact declarations from `src/app/globals.css`:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
  --color-primary: #0073E6;
  --color-navy: #0A192F;
}
```

```css
:root {
  --primary: #0073E6;
  --navy: #0A192F;
  --background: #FFFFFF;
  --foreground: #0A192F;
  --muted: #F1F5F9;
  --muted-foreground: #64748B;
  --accent: #F8FAFC;
  --accent-foreground: #0A192F;
  --border: #E2E8F0;
  --danger: #ef4444;
  --warning: #facc15;
  --success: #059669;
  --card: #FFFFFF;
  --card-foreground: #0A192F;
  --popover: #FFFFFF;
  --popover-foreground: #0A192F;
  --primary-foreground: #FFFFFF;
  --secondary: #F1F5F9;
  --secondary-foreground: #0A192F;
  --destructive: #ef4444;
  --destructive-foreground: #FFFFFF;
  --input: #E2E8F0;
  --ring: #0073E6;
  --radius: 8px;
}
```

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}
```

Notes:
- `--color-primary` is declared twice inside `@theme inline`; the final declaration in that block is `#0073E6`.
- `--font-geist-mono` is referenced in `globals.css` but is not declared there.
- `layout.tsx` sets `--font-sans` by loading `Inter` with `variable: "--font-sans"`.

### Border radius rule
- Base token is `--radius: 8px`.
- Derived theme radii are `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`.
- Most storefront UI uses `rounded-sm`.
- Use `rounded-[var(--radius)]` or `rounded-(--radius)` when matching the global token exactly.
- `rounded-full` is allowed ONLY for circular icon buttons and numeric counter badges (e.g. cart item count).
- `rounded-full` is STRICTLY FORBIDDEN on product badges (Hot Now, New, -20%, Sold Out, etc.). All product badges must use `rounded-[var(--radius)]`.

### Typography
- Global font source is `Inter` from `next/font/google`.
- Material Symbols Outlined is loaded globally in `<head>`.
- Headings and labels are usually uppercase with `font-bold`, `font-extrabold`, or `font-black`.
- Body copy usually uses default weight or `font-light`.
- `font-display` appears in JSX, but no matching Tailwind token/config exists. Treat `Inter` as the real configured font, not `font-display`.

## 5. Component Conventions
### Naming rules
- App-specific components use PascalCase filenames and named exports.
- UI primitives in `src/components/ui/` use lowercase filenames and named exports.
- Route entries stay in App Router files: `page.tsx`, `layout.tsx`, `not-found.tsx`.

```tsx
// App-specific component
export function Navbar() {}

// UI primitive
export { Button, buttonVariants }
```

### File locations
- `src/app/*`: routes and layout files.
- `src/components/layout/*`: global chrome.
- `src/components/cart/*`: cart overlay UI.
- `src/components/search/*`: search overlay UI.
- `src/components/ui/*`: shadcn/Radix-style primitives.
- `src/store/*`: Zustand stores.
- `src/lib/*`: shared helpers.
- Keep route-specific mock arrays close to the route/component that renders them until a real data layer exists.

## 6. State Management
### Every Zustand store, its file path, and what it manages
- `src/store/useCartUIStore.ts`
  - Manages cart drawer UI only.
  - State: `isOpen: boolean`
  - Actions: `openCart`, `closeCart`, `toggleCart`
- `src/store/useSearchUIStore.ts`
  - Manages search modal UI only.
  - State: `isOpen: boolean`
  - Actions: `openSearch`, `closeSearch`, `toggleSearch`

### Rules for creating new stores
- Put each store in its own file under `src/store/`.
- Name store hooks `useXStore`.
- Define a TypeScript interface first, then `create<Interface>()`.
- Keep stores small and single-purpose.
- Current stores are UI-only. Do not mix UI visibility flags with product, pricing, or checkout business data.
- Expose the minimum state and actions needed.
- Consume stores only from client components.

```ts
interface ExampleUIStore {
  isOpen: boolean
  open: () => void
  close: () => void
}
```

## 7. Routing
- App Router root is `src/app/`.
- Routes:
  - `/` -> `src/app/page.tsx`
  - `/products` -> `src/app/products/page.tsx`
  - `/product/[id]` -> `src/app/product/[id]/page.tsx`
  - `not-found` -> `src/app/not-found.tsx`
- Shared layout is `src/app/layout.tsx`.
- Use `next/link` for static navigation.
- Use `useRouter().push()` only inside client-side interaction handlers.
- Current product cards and search results navigate with a template-literal `router.push` call to `/product/${id}`.
- Current `/product/[id]` page does not read route params. It renders hardcoded product content regardless of `id`.

```tsx
<Link href="/products">Shop</Link>

router.push(`/product/${id}`)
```

## 8. Performance Rules
- Use `next/image` when the container size is known and the image host is already allowed.
- If you add a new remote image host, update `next.config.ts` first.
- All product images will eventually be served from Cloudinary. When migrating from hardcoded URLs, use Cloudinary's URL format and add the Cloudinary hostname to the `next.config.ts` allowlist before using `next/image`.
- Existing shared chrome uses `next/image`; existing route marketing grids still use raw `<img>`.
- If you keep using raw `<img>`, add `loading="lazy"` on non-critical images.
- Keep heavy interaction libraries in client components only.
- Do not add a global store for state that can stay local to one route/component.
- Reuse current hardcoded data shape until a real data layer is introduced. Do not half-migrate one screen to fetching.

## 9. Animation Rules (Framer Motion)
- Use Framer Motion for enter/exit animations in any client component. Prefer CSS transitions for hover and simple state styling.
- Use `AnimatePresence mode="wait"` for mount/unmount overlays.
- Current timing pattern:
  - Backdrop fade: `0.2s`
  - Panel fade/slide: `0.25s`
  - Panel initial offset: `y: -20`
- Use Swiper (`swiper/react`) for all sliders and carousels.
- Do not use Embla directly in storefront code.
- Keep motion short, functional, and inside client components.

```tsx
<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
  )}
</AnimatePresence>
```

## 10. Scrollbar Convention
- Global body scrollbar is thin.
- WebKit scrollbar width/height is `6px`.
- Track is transparent.
- Thumb color is `#d1d5db`.
- Thumb hover color is `#9ca3af`.
- Firefox uses `scrollbar-width: thin` and `scrollbar-color: #d1d5db transparent`.
- Use `.scrollbar-hidden` to hide scrollbars while preserving scroll behavior.
- `SearchModal` also sets inline `scrollbarWidth: 'none'` and `msOverflowStyle: 'none'`.
- Do not use `.scrollbar-hide`; it is referenced once, but it is not defined in `globals.css`.

## 11. STRICTLY FORBIDDEN (things that must never be done)
- Do not assume a `tailwind.config.ts` exists.
- Do not add remote image domains without updating `next.config.ts`.
- Do not create business-data Zustand stores next to the current UI stores without an explicit architecture change.
- Do not treat `font-display` as a valid configured typography utility.
- Do not use `.scrollbar-hide`; use `.scrollbar-hidden` or add a deliberate replacement first.
- Do not rename `src/components/ui/*` files to PascalCase.
- Do not assume `/product/[id]` is param-driven today.
- Do not leave duplicate `@keyframes marquee` and `.animate-marquee` blocks in `globals.css`. The file currently contains two copies - this must be cleaned up. Keep only one definition.
- Do not break the root layout contract that globally mounts `AnnouncementBar`, `Navbar`, `Footer`, `CartDrawer`, and `SearchModal`.

## 12. Checklist for adding a new feature
1. Put the file in the correct folder.
2. Reuse existing CSS variables from `globals.css`.
3. Keep corners small unless there is a clear exception.
4. Use `Link` for static navigation and `router.push()` only for client-side handlers.
5. Keep state local unless it is truly shared UI state.
6. If shared UI state is needed, add a small Zustand store under `src/store/`.
7. If remote images are used, confirm the hostname is already allowed.
8. Prefer CSS transitions first; use Framer Motion only for real enter/exit animation.
9. Match the existing scrollbar convention.
10. Test both mobile and desktop layout behavior.
11. If the feature requires data fetching, implement it via a Next.js API Route under `src/app/api/`. Do not call MongoDB or Cloudinary directly from client components.
12. Before copying an old pattern, check whether it is a known inconsistency (`font-display`, `.scrollbar-hide`, duplicate marquee block).

```tsx
// New static route link
<Link href="/products">Browse</Link>

// New UI-only store naming pattern
export const useExampleUIStore = create<ExampleUIStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
```
