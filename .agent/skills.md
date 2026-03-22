> !! AGENT: Read this entire file before touching any code in this project.

# Odda Store - Agent Skills & Project Rules

## 1. Project Overview

- Brand: `Odda | Premium Dental Tools` — High-end aesthetic for medical professionals.
- App type: Enterprise-ready Next.js App Router storefront and management system.
- Public routes: home, product listing, product details, bundle details (/bundle/[slug]), checkout, order confirmation, custom 404, public order tracking.
- Planned backend: Next.js API Routes (`src/app/api/`) as the server layer, MongoDB as the database (dedicated collections for Products and Bundles), and Cloudinary for image hosting and delivery.
- Current state: all data is served dynamically from MongoDB via API routes. MongoDB is the sole source of truth.
- Global chrome (`AnnouncementBar`, `Navbar`, `Footer`, `CartDrawer`, `SearchModal`, `ToastContainer`) is mounted in `src/app/(store)/layout.tsx`.
- **Enterprise Status**: Optimized for production with connection pooling, ISR caching, and automated DevOps cleanup via Vercel Cron.
- **Limit Protection**: Strategic usage of free-tier resources (Resend 3k/mo limit, Cloudinary storage reclamation).

## 2. Tech Stack & Versions

- Next.js `16.1.6`
- React `19.2.3`
- TypeScript `^5` (strict)
- Tailwind CSS `^4`
- Zustand `^5.0.11`
- Framer Motion `^12.35.2`
- Swiper `^12.1.2`
- Lucide React `^0.577.0`
- Mongoose (`mongoose`)
- NextAuth v5 (`next-auth@beta`)
- Cloudinary (`cloudinary`)
- Resend (`resend`)

## 3. Project Structure (actual file tree)

```text
odda-web/
  src/
    app/
      api/               # All server-side logic and DB interactions
      (dashboard)/       # Admin management views
      (store)/           # Public storefront pages
    components/
      shared/            # Reusable components across store/dashboard
      home/              # Home-page specific premium sections
      dashboard/         # Admin-only UI parts
      ui/                # Base Shadcn components
    lib/                 # Core logic, theme generation, API clients
    models/              # Mongoose Schemas
    store/               # Zustand state Management
    types/               # TypeScript type definitions (Models vs DTOs)
```

**Key Files:**
- `src/components/shared/Carousel.tsx` (Reusable Swiper wrapper)
- `src/components/shared/ImageUploader.tsx` (Universal upload handler)
- `src/lib/cloudinary.ts` (Image optimization and deletion logic)
- `src/lib/theme.ts` (Dynamic theme generation)
- `src/types/models.ts` (Server types) vs `src/types/store.ts` (Client types)

## 4. Design System & Tailwind Rules

- **Tailwind v4 tokens**: Use `bg-primary`, `bg-navy`, `text-foreground`, `border-border`.
- **Navy Variable**: `--navy` is NOT a CSS variable in `:root`. It is a theme token `--color-navy`. NEVER use `bg-(--navy)`. Use `bg-navy`.
- **Dynamic Radius**: Use `rounded-(--radius)` for elements that should respect the admin's radius setting.
- **Glassmorphism**: Use `bg-white/80 backdrop-blur-md` for floating elements like Navbars and Sticky Headers.

## 5. UI Component Rules

- **Shadcn First**: Always check `src/components/ui/` before building custom components.
- **StatusBadges**: Use `<StatusBadge status={status} />` for order/item statuses.
- **Buttons**: Every user-facing action must use the Shadcn `<Button>`. Link buttons use `asChild`.

## 6. Logic & State Management

- **Zustand**: Use for ephemeral UI state (Cart, Search, Toasts) and site-wide settings (Language).
- **Server Actions**: Not used. All data writes go through `src/app/api/`.

## 7. i18n & RTL Rules

- **Directionality**: Every main container must have `dir={language === 'ar' ? 'rtl' : 'ltr'}`.
- **Logical Properties**: Always prefer `ps-`, `pe-`, `ms-`, `me-`, `text-start`, `text-end`.
- **Swiper RTL**: Always pass `key={locale}` to Swiper instances to ensure re-mount on language change.

## 8. Routing Patterns

- **Slug-based**: Public products and bundles are accessed via `/product/[slug]` and `/bundle/[slug]`.
- **Internal API**: Components fetch from `/api/products/[slug]` to retrieve data.

## 9. Performance & Image Rules

- **Cloudinary Optimization**: Use `optimizeCloudinaryUrl(url, context)` for all raw `<img>` tags.
- **next/image**: Use for static assets or full-bleed heroes. next/image handles its own optimization; do NOT pass optimized Cloudinary URLs to it.

## 10. Forms & Validation

- **React Hook Form + Zod**: Every form (Product, Category, Settings) must have a schema in `src/lib/schemas.ts` or local Zod definition.
- **Image Priority**: In multi-image uploads, the first image selected is the primary image.

## 11. Security & Auth

- **Role Gate**: `/dashboard` routes are protected by middleware and higher-order layout checks for `role: 'admin'`.
- **Password Hashing**: Always use `bcryptjs` for auth-related password logic.

## 12. Business Parameters (Admin Settings)

Admin can configure the following in Dashboard -> Settings:
- **Announcements**: List of marquee messages (bilingual).
- **InstaPay**: Dedicated number for manual payment verification.
- **Shipping Fee**: Flat rate applied at checkout.
- **WhatsApp**: Direct contact for customer support.
- **Dynamic Theme**: 6 presets + custom color picker for brand primary.

## 13. Checklist for adding a new feature

1. Define Zod schema (if form/API).
2. Create Mongoose model (if new collection).
3. Implement API route under `src/app/api/`.
4. Create reusable UI parts in `components/`.
5. Wire to Zustand store if shared state is needed.

## 14. Project Gotchas

- **Type Separation**: Never import `src/types/models.ts` in Client Components. Use `src/types/store.ts`.
- **Status Colors**: Centralized in `src/lib/utils.ts` via `getStatusColor()`. Import and use specifically in `<StatusBadge>`.
- **Carousel Navigation**: Swiper buttons must have unique classes per page to avoid navigation conflicts.
- **UptimeRobot**: Pings `/api/warmup` every 5 min to keep Vercel and MongoDB active.

## 15. Forbidden Patterns

- **RTL Reversal**: NEVER use `flex-row-reverse` for general layout; it breaks when `dir="rtl"` is active.
- **Direct Swiper**: NEVER use raw `<Swiper>`. Use `<Carousel>`.
- **Direct Upload**: NEVER call `fetch('/api/upload')` directly in components. Use `src/lib/upload.ts` helpers.
- **generateThemeCSS client-side**: Never call this on the client. It is for server-side CSS injection ONLY. Use `generatePreviewCSS` for live previews.
- **Navy Variable**: Never use `bg-(--navy)` or `text-(--navy)`. Always use the token `bg-navy`.

## 16. Rules Index
Load the relevant rule file as context for your task:
- Architecture → `.agent/rules/architecture.md`
- Performance → `.agent/rules/performance.md`
- i18n & RTL → `.agent/rules/i18n.md`
- Design System → `.agent/rules/design-system.md`
- Forbidden Rules → `.agent/rules/forbidden.md`