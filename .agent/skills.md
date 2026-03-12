> ⚠️ AGENT: Read this entire file before touching any code in this project.

# Odda Store - Agent Skills & Project Rules

## 1. Project Overview
- Brand: `Odda | Premium Dental Tools` — High-end aesthetic for medical professionals.
- App type: Enterprise-ready Next.js App Router storefront and management system.
- Public routes: home, product listing, product details, checkout, order confirmation, custom 404, public order tracking.
- Planned backend: Next.js API Routes (`src/app/api/`) as the server layer, MongoDB as the database, and Cloudinary for image hosting and delivery.
- Current state: most data is served dynamically from MongoDB via API routes (`src/app/api/products`). The legacy catalog (`src/lib/catalog.ts`) is for fallback purposes only.
- Global chrome (`AnnouncementBar`, `Navbar`, `Footer`, `CartDrawer`, `SearchModal`, `ToastContainer`) is mounted in `src/app/(store)/layout.tsx`. Auth pages (`/login`, `/register`) have no chrome.
- **Enterprise Status**: Optimized for production with connection pooling, ISR caching (`StoreSettings`), and automated DevOps cleanup via Vercel Cron.
- **Limit Protection**: Strategic usage of free-tier resources (Resend 3k/mo limit, Cloudinary storage reclamation via `deleteCloudinaryImage` utility).
- **Global Configuration**: Centrally managed `StoreSettings` controlling the storefront UI and business parameters.

## 2. Tech Stack & Versions
- Next.js `16.1.6`
- React `19.2.3`
- React DOM `19.2.3`
- TypeScript `^5` with `strict: true`
- Tailwind CSS `^4`
- Zustand `^5.0.11`
- Framer Motion `^12.35.2`
- Swiper `^12.1.2`
- Lucide React `^0.577.0`. Lucide React is the only icon library. No CDN icons.
- Mongoose (`mongoose`)
- NextAuth v5 (`next-auth@beta`)
- MongoDB Auth Adapter (`@auth/mongodb-adapter`)
- bcryptjs (`bcryptjs`)
- Cloudinary (`cloudinary`)
- Resend (`resend`) — Optimized for transactional notifications.
- Vercel Cron — For automated maintenance tasks.

## 3. Project Structure (actual file tree)
- `src/lib/catalog.ts` is the legacy source of truth (kept for fallback). Real data is in MongoDB.
- Store pages use Server Components to fetch from internal API routes.

```text
odda-web/
  scripts/
    seed.ts
    migrate.ts
  src/
    app/
      api/
        auth/
        badges/
          route.ts
          [id]/
            route.ts
        categories/
          route.ts
          [id]/
            route.ts
        cron/
          cleanup-orders/ # Daily data/asset recycling
        notifications/   # In-app alert system
        orders/
          route.ts
          [id]/
          track/         # Public Amazon-style tracker
        products/
          route.ts
          [slug]/
            route.ts
        settings/        # Global Storefront Configuration
          route.ts
        users/           # Admin customer management
      (dashboard)/
        dashboard/
          badges/
          categories/
          customers/
          notifications/ # Admin activity center
          orders/
          products/
          settings/      # Multi-tab Admin Settings Hub
    components/
      home/
        Hero.tsx         # Premium Minimalist Hero
      dashboard/
        Sidebar.tsx
        AddProductButton.tsx
        ColorPicker.tsx # Custom swatch selector
        CustomersManager.tsx # Full profile/role control
        NotificationBell.tsx # Real-time polling alert
        NotificationsList.tsx
        OrderDetailsModal.tsx # With auto-scroll to proof
        OrdersManager.tsx # Tabbed "Inbox Zero" workflow
        ProductForm.tsx # With simulated upload feedback
        ProductsTable.tsx
    models/
      Badge.ts
      Category.ts
      Notification.ts # Alert tracking
      Order.ts
      Product.ts
      StoreSettings.ts   # Global Config (Hero, InstaPay, etc.)
      User.ts
    auth.ts # RBAC logic & session security
    middleware.ts # Protected route gates
```

> `src/lib/mongodb-adapter.ts` provides the raw MongoClient instance required by `@auth/mongodb-adapter`. It is separate from `mongodb.ts` (which uses Mongoose). Do not use `mongodb-adapter.ts` for data queries — use `mongodb.ts` + Mongoose models instead.


## 4. Design System
### CSS variables
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
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
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
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
  --primary-foreground: #FFFFFF;
  --secondary: #F1F5F9;
  --secondary-foreground: #0A192F;
  --destructive: #ef4444;
  --input: #E2E8F0;
  --ring: #0073E6;
  --radius: 8px;
}
```

### Border radius rule
- Base token is `--radius: 8px`.
- Use `rounded-(--radius)` for exact matches (preferred over `rounded-[var(--radius)]`).
- `rounded-full` ONLY for circular buttons/badges; FORBIDDEN on product badges.

## 5. Component Conventions
### Naming rules
- Route-specific loaders: `loading.tsx`.
- Business components: `ToastContainer.tsx`.
- UI primitives: `skeleton.tsx`, `Toast.tsx`.
- Route groups: use parentheses e.g. `(store)`, `(auth)`. Auth pages have no shared chrome.

## 6. State Management
### Zustand Stores
- `src/store/useCartUIStore.ts` (UI Only: isOpen, openCart, closeCart)
- `src/store/useSearchUIStore.ts` (UI Only: isOpen, openSearch, closeSearch)
- `src/store/useMobileMenuStore.ts` (UI Only: isOpen, open, close, toggle)
- `src/store/useCartStore.ts`
  - Manages cart data: `items`, `totalAmount`.
  - Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`.
- `src/store/useToastStore.ts`
  - Manages global notifications: `toasts: Toast[]`.
  - Actions: `addToast`, `removeToast`.
  - Convenient export: `toast` object for quick usage (`toast.success(description)`).
  - IMPORTANT: Notifications use `description` property, not `message`.
- `src/store/useRecentlyViewedStore.ts`
  - Manages viewed history: `items: Product[]` (max 4).
  - Actions: `addViewedItem`.

## 7. Routing
- `/` -> Home
- `/products` -> Product listing with filters.
- `/dashboard` -> Admin-only overview with stats and charts.
- `/dashboard/orders` -> Admin-only orders management.
- `/dashboard/settings` -> Admin-only configuration hub (Tabs: Storefront, Payments, Contact).
- `/dashboard/customers` -> Admin-only registered users list.
- **Products**: `/product/[slug]` — The param is the product slug (SEO-friendly). Always look up by `slug` in `CATALOG` or MongoDB.
- **Search**: `/search?q=query` — Results filtered by name.
- `/checkout` -> Multi-step checkout process. Now wired to `POST /api/orders`.
- `/order-confirmation` -> Post-purchase landing. Reads `orderNumber` from URL params.
- `/orders` -> User's order history, requires auth.
- `/about` -> Brand mission and features.
- `/login` -> User auth.
- `/register` -> New user registration. Wired to `POST /api/auth/register`.
- API Routes:
  - `POST /api/auth/register`: User creation.
  - `GET /api/products`: Paginated/Filtered product list. Supports `featured`, `categoryId`, `search`, `sort` params.
  - `GET /api/categories`: Returns all product categories.
  - `POST /api/categories`: Admin category creation.
  - `PATCH/DELETE /api/categories/[id]`: Admin category management (includes `revalidatePath('/')` and Cloudinary cleanup).
  - `GET /api/badges`: Returns all product badges.
  - `POST /api/badges`: Admin badge creation.
  - `PUT/DELETE /api/badges/[id]`: Admin badge management.
  - `GET /api/products/[slug]`: Single product lookup (SEO slug or ID).
  - `POST /api/products`: Admin product creation + Cloudinary upload.
  - `PUT /api/products/[slug]`: Admin product update.
  - `DELETE /api/products/[slug]`: Admin product removal + Cloudinary cleanup.
  - `GET /api/settings`: Returns Global Store Settings (Hero, Announcements, Fees).
  - `PATCH /api/settings`: Admin settings update (with instant ISR revalidation).
  - `POST /api/orders`: Order placement (triggers real-time stock deduction).
  - `GET /api/orders`: Admin order list.
  - `GET /api/orders/[id]`: Order details.
  - `PATCH /api/orders/[id]`: Admin order status update (Restores stock automatically on 'cancelled' status).
  - `GET /api/orders/track/[id]`: Public order tracking status.
  - `GET /api/notifications`: Admin alerts list.
  - `POST /api/cron/cleanup-orders`: Daily recycling of data/assets.
  - `POST /api/upload`: Generic image upload (supports `folder` param and 10MB limit).
- Route Grouping: `(store)` group has the global chrome layout; `(auth)` group has none.

## 8. Performance Rules
- Use `next/image` when the container size is known and the image host is already allowed.
- If you add a new remote image host, update `next.config.ts` first.
- All product images will eventually be served from Cloudinary. When migrating from hardcoded URLs, use Cloudinary's URL format and add the Cloudinary hostname to the `next.config.ts` allowlist before using `next/image`.
- Existing shared chrome uses `next/image`; existing route marketing grids still use raw `<img>`.
- If you keep using raw `<img>`, add `loading="lazy"` on non-critical images.
- Keep heavy interaction libraries in client components only.
- Do not add a global store for state that can stay local to one route/component.
- All product data must be fetched via `GET /api/products`. Do not import `CATALOG` for new features.
- Components should be Server Components where possible to leverage server-side fetching with revalidation.
- **Database Optimization**: Always call `connectDB()` at the top of every API Route handler. It implements strict connection pooling (`maxPoolSize: 10`) essential for serverless stability.
- **ISR Caching**: Public product APIs (`/api/products`) use `revalidate = 3600` (1-hour cache). Use `revalidatePath` in admin mutation handlers to invalidate this cache when data changes.
- Cloudinary uploads must always go through `src/lib/cloudinary.ts`. Never call Cloudinary SDK directly from a route handler.
- **Self-Cleaning Storage**: Use `deleteCloudinaryImage(url)` in mutation handlers when an entity with an image is deleted or its image is replaced.

## 9. Animation Rules (Framer Motion)
- Use Framer Motion for enter/exit animations in any client component. Prefer CSS transitions for hover and simple state styling.
- Use `AnimatePresence mode="wait"` for mount/unmount overlays.
- Current timing pattern:
  - Backdrop fade: `0.2s`
  - Panel fade/slide: `0.25s`
  - Panel initial offset: `y: -20`
- **Minimalist Hero**: Prefer high-impact static images with dark overlays and Ghost Buttons (fill-on-hover) over complex Swiper sliders for the storefront hero.
- Use Swiper (`swiper/react`) for smaller item carousels only.
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

## 11. STRICTLY FORBIDDEN
- Do not use `useEffect` + `useState` for deriving product data from params; use `useMemo`.
- Do not use hardcoded `PRODUCTS` arrays or `CATALOG` in pages; fetch from `/api/products` using Server Components.
- Do not perform synchronous `setState` inside `useEffect` (lint warning).
- Do not assume a `tailwind.config.ts` exists.
- Do not add remote image domains without updating `next.config.ts`.
- Do not create business-data Zustand stores next to the current UI stores without an explicit architecture change.
- Do not treat `font-display` as a valid configured typography utility.
- Do not use `.scrollbar-hide`; use `.scrollbar-hidden` or add a deliberate replacement first.
- Do not rename `src/components/ui/*` files to PascalCase.
- `/product/[slug]` is slug-driven. Always read `params.slug` and look up by `slug` from `CATALOG`. If not found, call `notFound()` from `next/navigation`. Never use MongoDB `_id` or numeric `id` in product page URLs.
- Do not leave duplicate `@keyframes marquee` and `.animate-marquee` blocks in `globals.css`. The file currently contains two copies - this must be cleaned up. Keep only one definition.
- Do not break the root layout contract.
- Do not integrate any real payment gateway.
- Do not use Material Symbols. Use Lucide React icons ONLY.
- Do not add store chrome (Navbar, Footer, AnnouncementBar, CartDrawer, SearchModal) to dashboard pages. Dashboard has its own layout.
- Do not add Navbar, Footer, AnnouncementBar, CartDrawer, or SearchModal to auth pages. Use route groups to isolate layouts.
- Do not import mongoose models on the client side. Models are server-only.
- Do not import `src/lib/cloudinary.ts` on the client side. Server-only.
- **Do not hardcode Order IDs in emails**: Inject `newOrder._id.toString()` dynamically.
- **Do not send notification emails to admins**: Use the dashboard bell system to save Resend quota.
- **No Self-Sabotage**: Admins cannot block, demote, or delete their own accounts.
- **Order Stock Integrity**: Never update an order to `cancelled` without restoring the stock.
- **Revenue Accuracy**: Never include `cancelled`, `failed`, or `pending` orders in dashboard revenue calculations.
- **Category UX**: Never implement category uploads without visual feedback (grayscale/progress).

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

## 13. Known Inconsistencies & Gotchas
- **Tailwind v4 syntax**: Lint prefers `rounded-(--radius)` over `rounded-[var(--radius)]`.
- **Image handling**: `next/image` is used in layout; pages still use raw `<img>` with `loading="lazy"`.
- **Checkout Auth**: Multi-step checkout with an authentication gate (Step 0) providing options for guest checkout or account sign-in.
- **Payment Verification**: Instapay requires a manual screenshot upload.
- **Material Symbols**: Fully removed and replaced with Lucide React SVG components.
- **Auth Pages**: Login and Register forms are fully wired to NextAuth credentials and Google OAuth.
- **Checkout**: Fully wired to real API routes for orders and payment uploads.
- **Order Confirmation**: Reads `orderNumber` from URL search params.
- **Accordions**: Use `Accordion` from `src/components/ui/accordion.tsx` instead of building custom toggle states.
- **Google Sign-In**: Google OAuth is fully wired via `signIn('google')`.
- **Navbar Session**: Navbar shows Sign In link for guests and a user dropdown with My Orders + Sign Out for authenticated users.
- **NextAuth v5 Configuration**: Uses `src/auth.ts` as the main config and `src/auth.config.ts` for Edge-compatible settings (required by middleware). JWT strategy is used to keep roles in the token. DB models must NOT be imported in `auth.config.ts`.
- **Seed Script**: Run `npm run seed` to populate MongoDB with products from `catalog.ts`. Safe to run multiple times — skips existing slugs.
- **Dashboard**: Admin-only route group at `(dashboard)/`. Protected at both middleware and layout level. Includes comprehensive Products, Categories, Badges, and Global Settings management.
- **Inventory Management**: Absolute stock management (deduction on order, restoration on cancellation). Stock sufficiency check occurs during `POST /api/orders`.
- **Global Settings Hub**: Single-document pattern for managing announcements, fees, and hero content. Includes multi-tab (Storefront, Clinical, Contact) configuration UI.
- **UI/UX Polished Elements**:
  - **Hero**: Minimalist static image with Ghost Button (fill-on-hover effect).
  - **Footer**: Professional 4-column dynamic grid fueled by `StoreSettings`.
  - **Cart**: Dynamic badge using Zustand `useCartStore` real quantities.
  - **Checkout**: Shadcn "Check Email" toast triggered post-success.
  - **Pagination**: Server-side pagination UI for the public Products grid.
  - **Navbar**: Real category data fetching for dropdowns.
  - **Uploads**: Grayscale + Progress bar feedback ported to Category uploads.
- **Storage Management**: Automated Cloudinary asset destruction via centralized `deleteCloudinaryImage` utility.

## 14. SEO & Routing
- **Product URLs**: All product links must use `product.slug` (e.g., `/product/dental-handpiece-pro`). Never use MongoDB `_id` or numeric `id` in the URL.
- **Param Handling**: In `[slug]/page.tsx`, always look up by `params.slug` from MongoDB via `GET /api/products/[slug]`. If not found, call `notFound()`.
- **API Support**: The products API (`/api/products/[slug]`) supports both slug and MongoDB `_id` for backward compatibility, but slug is always preferred.
