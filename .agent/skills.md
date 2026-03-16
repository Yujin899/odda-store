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

        warmup/          # Cold start prevention

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

        CustomersManager.tsx # Layout orchestrator (~100 lines)

        CustomersParts/
          CustomersTable.tsx
          EditUserDialog.tsx
          ResetPasswordDialog.tsx
          BlockUserDialog.tsx
          DeleteUserDialog.tsx
          useCustomers.ts

        NotificationBell.tsx # Real-time polling alert

        NotificationsList.tsx

        OrderDetailsModal.tsx # With auto-scroll to proof

        OrdersManager.tsx # Tabbed "Inbox Zero" workflow

        CategoriesClient.tsx # State + fetch logic only (~100 lines)

        CategoriesParts/
          CategoriesTable.tsx
          CategoryDialog.tsx
          CategoryForm.tsx
          DeleteCategoryDialog.tsx

        ProductForm.tsx # With BYOAI "Magic Fill" logic

        ProductsTable.tsx

        SettingsForm.tsx # Form provider + submit handler (~100 lines)

        SettingsFormParts/ # Form decomposition directory

          StorefrontTab.tsx

          CheckoutTab.tsx

          EmailsTab.tsx

          useSettingsAI.ts # Shared settings generation logic

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

      api.ts           # Consolidated fetch helpers

      cloudinary.ts

      cloudinary-utils.ts

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

- `/order-confirmation` -> Post-accumulation landing. Reads `orderNumber` from URL params.

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
- **Global Settings Hub**: Single-document pattern for managing announcements, fees, and hero content. Decomposed into modular tabs (`StorefrontTab`, `CheckoutTab`, `EmailsTab`) using `FormProvider` to prevent God Component bloat.

- **Cold Start Prevention**: UptimeRobot pings `/api/warmup` every 5 minutes to keep the serverless function and MongoDB connection alive on Vercel Free tier.

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

- **CategoriesClient**: Refactored into `CategoriesParts/`. Parent handles state and API calls only. Children receive props.

- **CustomersManager**: Refactored into `CustomersParts/`. Parent is layout only. All state and API calls in `useCustomers.ts`.

- **JSDoc Standard**: All exported functions in `src/lib/` and all types in `src/types/` must have JSDoc comments. Focus on WHY and WHEN, not just WHAT.

- **Swiper RTL**: Always pass `key={locale}` and `dir={isRtl ? 'rtl' : 'ltr'}` to every Swiper instance. The `key` prop forces re-mount on locale change, ensuring correct RTL behavior without a full page reload.

- **RatingSummary**: Reusable star rating display. Returns null if no reviews. Used in ProductCard and BundleCard.

## Rules Index
Load the relevant rule file as context for your task:
- Architecture & Components → `.agent/rules/architecture.md`
- Security & Auth → `.agent/rules/security.md`
- Performance & Caching → `.agent/rules/performance.md`
- i18n & RTL → `.agent/rules/i18n.md`
- Forbidden Rules → `.agent/rules/forbidden.md`
- TypeScript Types → `.agent/rules/types.md`
- Design System → `.agent/rules/design-system.md`