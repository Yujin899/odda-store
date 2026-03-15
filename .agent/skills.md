> !! AGENT: Read this entire file before touching any code in this project.

# Odda Store - Agent Skills & Project Rules

## 1. Project Overview

- Brand: `Odda | Premium Dental Tools` — High-end aesthetic for medical professionals.

- App type: Enterprise-ready Next.js App Router storefront and management system.

- Public routes: home, product listing, product details, bundle details (/bundle/[slug]), checkout, order confirmation, custom 404, public order tracking.

- Planned backend: Next.js API Routes (`src/app/api/`) as the server layer, MongoDB as the database (dedicated collections for Products and Bundles), and Cloudinary for image hosting and delivery.

- Current state: all data is served dynamically from MongoDB via API routes (`src/app/api/products` and `/api/bundles`). MongoDB is the sole source of truth.

- Global chrome (`AnnouncementBar`, `Navbar`, `Footer`, `CartDrawer`, `SearchModal`, `ToastContainer`) is mounted in `src/app/(store)/layout.tsx`. Auth pages (`/login`, `/register`) have no chrome.

- **Enterprise Status**: Optimized for production with connection pooling, ISR caching (`StoreSettings`), and automated DevOps cleanup via Vercel Cron.

- **Limit Protection**: Strategic usage of free-tier resources (Resend 3k/mo limit, Cloudinary storage reclamation). We strictly support ONLY TWO transactional emails: "Order Confirmation" and "Order Shipped" to protect quotas.

- **Global Configuration**: Centrally managed `StoreSettings` controlling the storefront UI, business parameters, `defaultLanguage` ('en' or 'ar'), and fallback email text to prevent empty dispatches.

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

          register/

            route.ts

          [...nextauth]/

            route.ts

        badges/

          route.ts

          [id]/

            route.ts

        bundles/         # Dedicated Bundle Collection API

          route.ts

          [slug]/

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

            reviews/     # Authenticated product reviews

              route.ts

        settings/        # Global Storefront Configuration

          route.ts

        users/           # Admin customer management

      (dashboard)/

        dashboard/

          badges/

          bundles/       # Dedicated Bundle Management

          categories/

          customers/

          notifications/ # Admin activity center

          orders/

          products/

          settings/      # Multi-tab Admin Settings Hub

      (auth)/

        login/

          page.tsx

        register/

          page.tsx

      (store)/

        layout.tsx

        page.tsx

        about/

          page.tsx

        checkout/

          page.tsx

        order-confirmation/

          page.tsx

        orders/

          loading.tsx

          page.tsx

        product/

          [slug]/

            loading.tsx

            page.tsx

        products/

          loading.tsx

          page.tsx

        search/

          loading.tsx

          page.tsx

        bundle/

          [slug]/

            page.tsx

        bundles/

          page.tsx

        profile/

          page.tsx

    components/

      home/

        Hero.tsx         # Premium Minimalist Hero

        HomeBundles.tsx  # Premium grid for Starter Kits

      bundles/           # Bundle-specific UI

        BundlePageClient.tsx

        BundleCard.tsx # Reusable premium card for bundles

      dashboard/

        Sidebar.tsx

        AddProductButton.tsx

        ColorPicker.tsx # Custom swatch selector

        CustomersManager.tsx # Full profile/role control

        NotificationBell.tsx # Real-time polling alert

        NotificationsList.tsx

        OrderDetailsModal.tsx # With auto-scroll to proof

        OrdersManager.tsx # Tabbed "Inbox Zero" workflow

        ProductForm.tsx # With BYOAI "Magic Fill" logic

        ProductsTable.tsx

        SettingsForm.tsx # With Store-wide BYOAI config

      products/

        ProductCard.tsx

        ProductFilters.tsx

        ProductPageClient.tsx # Multi-tab (Overview/Specs/Reviews)

      store/

        MobileBottomNav.tsx

        OrderTracker.tsx

        OrdersList.tsx

      shared/

        ReviewSection.tsx # Polymorphic review handler (Products/Bundles)

        AddToCartSection.tsx # Reusable quantity counter + add to cart

    lib/

      catalog.ts       # Legacy  seed script only

      cloudinary.ts

      mongodb.ts

      mongodb-adapter.ts

      utils.ts

    models/

      Badge.ts

      Bundle.ts          # Dedicated Mongoose Schema for Kits

      Category.ts

      Notification.ts # Alert tracking

      Order.ts

      Product.ts

      Review.ts          # Polymorphic Reviews (Scalable Collection)

      StoreSettings.ts   # Global Config (Hero, InstaPay, etc.)

      User.ts

    store/

      useCartStore.ts

      useCartUIStore.ts

      useLanguageStore.ts

      useMobileMenuStore.ts

      useRecentlyViewedStore.ts

      useSearchUIStore.ts

      useToastStore.ts

    types/

      next-auth.d.ts

    auth.config.ts

    auth.ts

    middleware.ts

```

## 4. Design System

### CSS variables

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

### Dashboard Mobile-First Architecture

- **Sidebar & Navigation**: The Dashboard Layout uses a responsive Sidebar. On mobile (screens < md), it operates as an off-canvas drawer controlled by a Hamburger menu in the top bar, with a modal backdrop.

- **Form Layouts**: Complex forms (ProductForm, SettingsForm) must use a 1-column grid on mobile and expand to multi-column on larger screens (`grid-cols-1 lg:grid-cols-3`).

- **Responsive Dialogs**: Modals/Dialogs must remain fully usable on small screens via bounded widths and internal scrolling (e.g., `max-w-[95vw]`, `max-h-[85vh] overflow-y-auto`).

- **Toast Sizing**: All global toasts must be constrained on mobile to prevent full-width covering of UI (`max-w-[90vw] sm:max-w-md mx-auto`).

### Mobile Application Navigation Standard

- **Architecture**: Both Storefront and Admin Dashboard utilize a "Mobile Bottom Navigation Bar" (Glassmorphism, `fixed bottom-0`, `z-50`).

- **Critical Layout Rule**: To prevent these fixed bars from covering content (like the Footer or data tables), the main wrapper in `src/app/(store)/layout.tsx` and `src/app/(dashboard)/layout.tsx` MUST use responsive bottom padding (e.g., `pb-20 md:pb-0`).

### Border radius rule

- Base token is `--radius: 8px`.

- Use `rounded-(--radius)` for exact matches (preferred over `rounded-[var(--radius)]`).

- `rounded-full` ONLY for circular buttons/badges; FORBIDDEN on product badges.

- **Directional UI**: For icons (e.g., arrows) or transforms that must mirror in RTL, use the `rtl:` modifier (e.g., `rtl:rotate-180`, `rtl:-translate-x-4`).

- **Physical Property Ban**: Under NO circumstances should physical CSS properties for horizontal layout (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`) be used. ALWAYS use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, `text-end`) to ensure native LTR/RTL support.

## 5. Zero-Trust Security & PII Shielding

We operate under a "Zero-Trust" model where the backend is the only source of truth and data leakage is a critical failure.

- **DTO-First Response Pattern**: We **never** leak raw database structures. Every API response and server action must pass through a Data Transfer Object (DTO) layer or a strict `.map()` cleanup that:

    - Flattens `_id` into a string.

    - Strips raw Mongoose metadata like `__v`.

    - Sanitizes PII (Personally Identifiable Information) by returning only the fields required for the specific UI view.

- **Backend Price Integrity**: We **never** trust prices or subtotals sent from the client. The server re-fetches product data directly from MongoDB during checkout to calculate the final price.

- **PII Lockdown**: For customer-facing lists (Reviews, Public Tracking), we strip sensitive details (email, phone, internal notes) at the database projection level.

## 6. Architecture & State Standards

### [ARCHITECTURE] Strict Leaf Component Architecture

To maintain maximum build performance (Turbopack compatibility) and SEO integrity, we enforce a strict separation between the "Server Shell" and "Client Islands."

- **The Server-Component-First Rule**: Every `page.tsx` file MUST be a Server Component. The use of `"use client"` at the route level is STRICTLY FORBIDDEN. This ensures that the entry point of every URL is indexed with 100% of its content.

- **Interactivity Extraction**: All client-side logic (Framer Motion animations, `useState`/`useEffect`, Forms, and Lucide icons that depend on interaction) MUST be extracted into a dedicated `[PageName]Client.tsx` leaf component.

- **The "...Parts/" Folder Convention**: To prevent "God Components" in the dashboard or complex store pages, sub-sections of a leaf component must be decomposed into a local `Parts/` directory. 

    - *Example*: `src/components/dashboard/ProductsTableParts/TableRow.tsx`.

### Form Architecture (The God Component Killer)

- **Modularization**: Any form exceeding 150 lines or containing complex nested state MUST use `react-hook-form` with `zodResolver`. 

- **Pattern**: It MUST be broken down using the `<FormProvider>` and `useFormContext` pattern to avoid prop-drilling. 

- **Parent Responsibility**: The parent file acts ONLY as the state initializer, resolver provider, and API submitter.

- **Child Responsibility**: Child components must be extracted into a `[FormName]Parts/` directory and handle specific UI sections independently.

### Server-First & Client Islands

- **Default**: Default to Server Components for SEO and performance. Fetch SEO-critical data (Categories, Products, Reviews, Settings) server-side.

- **No Side-Effects for Init**: Never use `useEffect` for initial data fetching in Page components.

- **Islands**: Extract interactivity into minimal `<... client />` islands (e.g., `<AddToCartButton />`, `<MobileMenu />`, `<FormHeader />`) to keep the JavaScript bundle small and preserve SSR fallbacks.

### [SECURITY] RBAC Gatekeeping

Administrative and sensitive data access must be protected at the route level using a standardized RBAC (Role-Based Access Control) check.

- **Standard Check**: Every `app/api/admin` route or sensitive GET/PATCH/DELETE handler MUST invoke `auth()` and strictly verify the user role:

  ```typescript

  const session = await auth();

  if (!session || session.user.role !== 'admin') {

    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  }

  ```

- **Zero-Exceptions**: There are no "public-by-convenience" admin routes. If it touches the management layer, it requires an 'admin' session check.


## 7. State Management

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

  - **Clean UX Rule**: When an action results in a major UI state change (e.g., opening the Cart Drawer upon clicking "Add to Cart"), DO NOT fire a success Toast simultaneously. The visual feedback is sufficient.

- `src/store/useRecentlyViewedStore.ts`

  - Manages viewed history: `items: Product[]` (max 4).

  - Actions: `addViewedItem`.

- `src/store/useLanguageStore.ts`

  - Manages site-wide locale state (`en` vs `ar`).

  - Persists preference across sessions.

## 8. Routing

- `/` -> Home

- `/products` -> Product listing with filters.

- `/bundles` -> Dedicated storefront catalog page listing all active Bundles and Starter Kits (kept strictly separate from `/products`).

- `/bundle/[slug]` -> Dedicated storefront page for Bundles/Starter Kits.

- `/dashboard` -> Admin-only overview with stats and charts.

- `/dashboard/orders` -> Admin-only orders management.

- `/dashboard/bundles` -> Admin-only bundle management.

- `/dashboard/settings` -> Admin-only configuration hub (Tabs: Storefront, Payments, Contact).

- `/dashboard/customers` -> Admin-only registered users list.

- **Products**: `/product/[slug]` — The param is the product slug (SEO-friendly). Always look up by `slug` in MongoDB.

- **Category Filter**: `/products?category=slug` — Standardized filtering uses category slug. The API resolves the slug to a MongoDB `_id` server-side via `Category.findOne({ slug })`.

- **Search**: `/search?q=query`  Results filtered by name.

- `/checkout` -> Multi-step checkout process. Now wired to `POST /api/orders`.

- `/order-confirmation` -> Post-purchase landing. Reads `orderNumber` from URL params.

- `/orders` -> User's order history, requires auth.

- `/about` -> Brand mission and features.

- `/login` -> User auth.

- `/register` -> New user registration. Wired to `POST /api/auth/register`.

- `/profile` -> **Role-Based Profile Hub**: Acts as the central user hub. Conditionally renders the "Admin Dashboard" link card ONLY if `session?.user?.role === 'admin'`. Floating Admin buttons are strictly forbidden.

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

  - `GET /api/bundles`: Returns all bundles (filtered by `stock` in storefront).

  - `GET /api/bundles/[slug]`: Single bundle lookup.

  - `POST /api/bundles`: Admin bundle creation.

  - `PUT /api/bundles/[slug]`: Admin bundle update.

  - `DELETE /api/bundles/[slug]`: Admin bundle removal.

  - `GET /api/settings`: Returns Global Store Settings (Hero, Announcements, Fees).

  - `PATCH /api/settings`: Admin settings update (with instant ISR revalidation).

  - `POST /api/orders`: Order placement (triggers real-time stock deduction).

  - `GET /api/orders`: Admin order list.

  - `GET /api/orders/[id]`: Order details.

  - `PATCH /api/orders/[id]`: Admin order status update (Restores stock automatically on 'cancelled' status).

  - `GET /api/orders/track/[id]`: Public order tracking status.

  - `POST /api/products/[slug]/reviews`: Authenticated product review submission.

  - `POST /api/bundles/[slug]/reviews`: Authenticated bundle review submission.

  - `GET /api/notifications`: Admin alerts list.

  - `POST /api/cron/cleanup-orders`: Daily recycling of data/assets.

  - `POST /api/upload`: Generic image upload (supports `folder` param and 10MB limit).

- Route Grouping: `(store)` group has the global chrome layout; `(auth)` group has none.

## 9. Performance Rules

### [DATABASE] Free-Tier Database Survival

To maintain stability on MongoDB Atlas M0 (Free Tier), we enforce strict connection hygiene:

- **Connection Mandate**: Every API Route handler MUST call `await connectDB()` as its first line of execution.

- **Pooling Limit (`maxPoolSize: 10`)**: We strictly limit concurrent connections to 10. Do NOT override the `maxPoolSize` in local configurations; this is the threshold for serverless survival on zero budget.

- **Lean Queries**: Always use `.lean()` on read-only Mongoose queries (`Product.find().lean()`) to reduce memory overhead and bypass hydration of full Mongoose documents when only data is needed.

### [CACHING] Edge Caching & Revalidation Orchestration

We prioritize speed and resource preservation by leveraging Next.js Data Cache to minimize database load.

- **Fast-Storefront Pattern**: All storefront data fetching (Products, Categories, Bundles) MUST use `unstable_cache` to achieve sub-100ms TTFB. This prevents repetitive Mongoose queries for stable content.

- **On-Demand Revalidation**: We use a "Mutation-Triggered" cache invalidation strategy. EVERY Admin Action or API that modifies data MUST call `revalidateTag()` for the relevant domain. This ensures the storefront updates instantly without requiring background polling.

- **The "Three-Layer" Revalidation**:

    1. **Admin Action**: User updates a price.

    2. **API Logic**: Mongoose `findOneAndUpdate` executes.

    3. **Edge Signal**: `revalidateTag('products-list')` is called before the response returns.

### [TAGS] The Global Tag Manifest

Use these standardized tags for `unstable_cache` and `revalidateTag` to maintain consistency across the orchestration layer:

| Domain | Tag Name | Invalidation Trigger |

| :--- | :--- | :--- |

| **Products** | `products-list` | `POST /api/products`, `PUT /api/products`, `DELETE /api/products` |

| **Categories** | `categories-list` | `POST/PATCH/DELETE /api/categories` |

| **Bundles** | `bundles-list` | `POST/PUT/DELETE /api/bundles` |

| **Orders** | `orders` | `POST /api/orders` (Admin list update) |

| **Settings** | `store-settings` | `PATCH /api/settings` |

- Use `next/image` when the container size is known and the image host is already allowed.

- If you add a new remote image host, update `next.config.ts` first.

- All product images will eventually be served from Cloudinary. When migrating from hardcoded URLs, use Cloudinary's URL format and add the Cloudinary hostname to the `next.config.ts` allowlist before using `next/image`.

- Existing shared chrome uses `next/image`; existing route marketing grids still use raw `<img>`.

- If you keep using raw `<img>`, add `loading="lazy"` on non-critical images.

- Keep heavy interaction libraries in client components only.

- Do not add a global store for state that can stay local to one route/component.

- All product data must be fetched via `GET /api/products`.

- Components should be Server Components where possible to leverage server-side fetching with revalidation.

- Cloudinary uploads must always go through `src/lib/cloudinary.ts`. Never call Cloudinary SDK directly from a route handler.
- **Image Optimization**: Use `optimizeCloudinaryUrl()` from `src/lib/cloudinary-utils.ts` for all storefront image URLs. Pass `width` based on context (600 for cards, 1200 for detail pages, 1920 for hero). Never optimize admin dashboard images.
- **Self-Cleaning Storage**: Use `deleteCloudinaryImage(url)` in mutation handlers when an entity with an image is deleted or its image is replaced.

## 10. Animation Rules (Framer Motion)

- Use Framer Motion for enter/exit animations in any client component. Prefer CSS transitions for hover and simple state styling.

- Use `AnimatePresence mode="wait"` for mount/unmount overlays.

- Current timing pattern:

  - Backdrop fade: `0.2s`

  - Panel fade/slide: `0.25s`

  - Panel initial offset: `y: -20`

- **Minimalist Hero**: Prefer high-impact static images with dark overlays and Ghost Buttons (fill-on-hover) over complex Swiper sliders for the storefront hero.

- Use Swiper (`swiper/react`) for smaller item carousels only.

- Keep motion short, functional, and inside client components.

```tsx

<AnimatePresence mode="wait">

  {isOpen && (

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

  )}

</AnimatePresence>

```

## 11. Scrollbar Convention

- Global body scrollbar is thin.

- WebKit scrollbar width/height is `6px`.

- Track is transparent.

- Thumb color is `#d1d5db`.

- Thumb hover color is `#9ca3af`.

- Firefox uses `scrollbar-width: thin` and `scrollbar-color: #d1d5db transparent`.

- Use `.scrollbar-hidden` to hide scrollbars while preserving scroll behavior.

- `SearchModal` also sets inline `scrollbarWidth: 'none'` and `msOverflowStyle: 'none'`.

## 12. STRICTLY FORBIDDEN

- **ABSOLUTE BAN on Raw Document Returns**: Do not return raw Mongoose documents (objects with `_id` as an object, `__v`, or internal methods) to the client. This is a primary source of hydration errors and security leaks. Every response MUST be sanitized via DTO or `.map()`.

- **DTO Rule**: NEVER return raw Mongoose documents from an API. You MUST use the mandatory `.map()` or DTO pattern to flatten ObjectIds into strings and strip raw metadata (`__v`) or internal admin notes. This prevents PII (Personally Identifiable Information) leakage.

- **Mongoose Serialization**: Never pass raw Mongoose documents to Client Components. Even with `.lean()`, sub-documents in arrays (like `images`) can contain `_id` buffers. Always map to strictly plain objects first.

- **Security Rule**: NEVER bypass `auth()` checks on sensitive APIs like `GET /api/orders`. All administrative data access must strictly verify the 'admin' role.

- Do not use `useEffect` + `useState` for deriving product data from params; use `useMemo`.

- Do not perform synchronous `setState` inside `useEffect` (lint warning).

- Do not add remote image domains without updating `next.config.ts`.

- Do not create business-data Zustand stores next to the current UI stores without an explicit architecture change.

- Do not rename `src/components/ui/*` files to PascalCase.

- `/product/[slug]` is slug-driven. Always read `params.slug` and look up by `slug` from MongoDB. If not found, call `notFound()` from `next/navigation`. Never use MongoDB `_id` or numeric `id` in product page URLs.

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

- **Mobile Input Safety**: Do not use absolute buttons inside inputs on mobile viewports.

- **i18n Safety**: Never set a required constraint on an Arabic field (`*Ar`) in Mongoose; they must remain optional to support legacy data.

- **Floating Buttons**: Do not use floating Admin buttons on any public storefront page. Admin access must flow through `/profile`.

- **Email Redundancy**: Never implement or trigger a "Delivered" email template. This is redundant and wastes Resend free-tier quota.

- **AI Backend**: Do not install or use `@google/generative-ai` or OpenAI SDKs in the backend API.

- **Clean Architecture Separation**: Bundles and Products MUST remain separated in the database (dedicated collections) and UI. Re-adding `isBundle` flags inside the `Product` model is STRICTLY FORBIDDEN.

- **Physical Property Ban**: Do not use physical CSS properties for horizontal layout (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`). Always use logical properties to ensure automatic RTL support.

- **Server-Side Direction**: Do not rely exclusively on Zustand (`useLanguageStore`) for initial language detection in Server Components (like `layout.tsx`). You must read the `NEXT_LOCALE` cookie to set the HTML `dir` and `lang` attributes to prevent hydration mismatches.

## 13. Checklist for adding a new feature

1. Put the file in the correct folder.

2. Reuse existing CSS variables from `globals.css`.

3. Keep corners small unless there is a clear exception.

4. Use `Link` for static navigation and `router.push()` only for client-side handlers.

5. Keep state local unless it is truly shared UI state.

6. If shared UI state is needed, add a small Zustand store under `src/store/`.

7. If remote images are used, confirm the hostname is already allowed.

8. Prefer CSS transitions first; use Framer Motion only for real enter/exit animation.

9. Match the existing scrollbar convention.

10. Test both mobile and desktop layout behavior, ensuring tables use `overflow-x-auto` and action bars stack correctly on small screens.

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

## 14. Known Inconsistencies & Gotchas

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

- **Seed Script**: Run `npm run seed` to populate MongoDB with products. Safe to run multiple times  skips existing slugs.

- **Dashboard**: Admin-only route group at `(dashboard)/`. Protected at both middleware and layout level. Includes comprehensive Products, Categories, Badges, and Global Settings management.

- **Inventory Management**: Absolute stock management (deduction on order, restoration on cancellation). Stock sufficiency check occurs during `POST /api/orders`.
- **Arabic Search**: `GET /api/products` searches both `name` and `nameAr` fields using `$or`. Arabic text uses `.includes()` not `.toLowerCase().includes()`.
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

- **Scalable Reviews Data**: Reviews are NO LONGER embedded. They use a dedicated `Review` collection with a Polymorphic Association (`targetId` and `targetType` for 'Product' or 'Bundle'). Average ratings and review counts are updated automatically on the parent document via MongoDB Aggregation Pipelines during review submission.

- **Google OAuth Production Mismatch**: When deploying to Vercel, `NEXTAUTH_URL` and `AUTH_URL` must exactly match the production domain (no trailing slashes). In Google Cloud Console, the "Authorized redirect URIs" MUST be exactly `https://[your-domain]/api/auth/callback/google` to prevent `Error 400: redirect_uri_mismatch`.

- **AddToCartSection.tsx**: Reusable quantity counter and add-to-cart button for product/bundle pages. Fixes mobile layout issues and centralizes cart logic.
- **Category URLs**: ALWAYS use `?category=slug`. Never `?categoryId=`. This applies to breadcrumbs, home page, and any other category link. The API resolves slug to `_id` server-side.

## 15. SEO & Routing

### [SEO] SEO Dominance & E-E-A-T

We establish entity-based search authority through technical precision and bilingual intent mapping.

- **Mandatory JSON-LD**: Core storefront pages MUST inject structured data via `<script type="application/ld+json">` to establish E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness):

    - **Home**: `Organization` & `Website`.

    - **Listings**: `ItemList`.

    - **Product/Bundle Details**: `Product` (with aggregateRating and offers).

- **Bilingual Intent Strategy**: We target two distinct search profiles in our metadata:

    1. **Formal Brand Intent**: Branded keywords using the correct glyphs (**3udda** (formal Arabic: عُدّة)).

    2. **Common Search Volume**: High-traffic plain-text variants (**3eda** (common Arabic: عدة)) to capture broad intent.

- **Product URLs**: All product links must use `product.slug` (e.g., `/product/dental-handpiece-pro`). Never use MongoDB `_id` or numeric `id` in the URL.

- **Param Handling**: In `[slug]/page.tsx`, always look up by `params.slug` from MongoDB via `GET /api/products/[slug]`. If not found, call `notFound()`.

## 16. Internationalization (i18n) Patterns

- **Database Schema**: We support bilingual data (English/Arabic). Arabic fields use the `*Ar` suffix (e.g., `nameAr`, `descriptionAr`, `featuresAr`).

- **Data Integrity**: All `*Ar` fields MUST be optional in Mongoose models (`required: false`) to avoid breaking existing data that only has English fields.

- **Graceful Fallback**: APIs and Frontend components must handle missing Arabic data gracefully, falling back to the English equivalent or an empty state without error.

- **Dashboard Forms**: Admin forms must accommodate both locales, stacking inputs on mobile and using logical side-by-side layouts on desktop.

- **Language Switching Workflow**: When a user changes the language on the client:

  1. The application MUST set the `NEXT_LOCALE` cookie (`document.cookie = "NEXT_LOCALE=ar; path=/; ..."`) to persist the choice.

  2. The application MUST immediately call `router.refresh()` to trigger a server-side re-render of the layout, ensuring the `<html>` tag's `dir` and `lang` attributes are updated correctly for all components.

### [i18n] Server-Side Direction Integrity

Relying solely on Client-Side state for language detection is strictly forbidden as it causes "Layout Shifting" and "Hydration Mismatches."

- **The Cookie Rule**: Server Components and the root `layout.tsx` MUST rely on the `NEXT_LOCALE` cookie to determine the initial `dir` (rtl/ltr) and `lang` attributes. 

- **Anti-Pattern**: Do NOT check Zustand (`useLanguageStore`) to set the `<html>` or `<body>` direction. Zustand is for reactive client updates; Cookies are for the initial Server-Side response.

- **AI Content Generation (BYOAI)**: 

  - Admin clicks "Copy AI Prompt" (which includes the entity name).

  - Admin pastes prompt into an external LLM (ChatGPT/Claude).

  - Admin pastes resulting JSON into form textarea.

  - "Magic Fill" button parses this JSON (strips markdown) and populates the form using `react-hook-form`'s `setValue`.

  - **Bundle Prompting**: `BundleForm` uses a specialized prompt that instructs the AI to generate `bundleItems` and `bundleItemsAr` arrays specifically for starter kits.

- **Zero-Cost Rationale**: The `Product` model includes `aiSummary` and `aiSummaryAr` which are statically rendered on the storefront as an "AI Rationale" to accelerate customer purchasing decisions.