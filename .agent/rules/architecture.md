# Architecture & Components Rules
This file covers strict leaf component patterns, form modularization, server-first islands, and role-based gatekeeping.

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
