# Forbidden Rules
These rules are non-negotiable. Violating any of these is a critical error.

## 12. STRICTLY FORBIDDEN

- **ABSOLUTE BAN on Raw Document Returns**: Do not return raw Mongoose documents (objects with `_id` as an object, `__v`, or internal methods) to the client. This is a primary source of hydration errors and security leaks. Every response MUST be sanitized via DTO or `.map()`.

- **DTO Rule**: NEVER return raw Mongoose documents from an API. You MUST use the mandatory `.map()` or DTO pattern to flatten ObjectIds into strings and strip raw metadata (`__v`) or internal admin notes. This prevents PII (Personally Identifiable Information) leakage.

- **Mongoose Serialization**: Never pass raw Mongoose documents to Client Components. Even with `.lean()`, sub-documents in arrays (like `images`) can contain `_id` buffers. Always map to strictly plain objects first.

- **Security Rule**: NEVER bypass `auth()` checks on sensitive APIs like `GET /api/orders`. All administrative data access must strictly verify the 'admin' role.

- **No Self-Sabotage**: Admins cannot block, demote, or delete their own accounts.

- **AI Backend**: Do not install or use `@google/generative-ai` or OpenAI SDKs in the backend API.

- **Email Redundancy**: Never implement or trigger a "Delivered" email template. This is redundant and wastes Resend free-tier quota.

- **Do not send notification emails to admins**: Use the dashboard bell system to save Resend quota.

- **Physical Property Ban**: Do not use physical CSS properties for horizontal layout (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`). Always use logical properties to ensure automatic RTL support.

- **Order Stock Integrity**: Never update an order to `cancelled` without restoring the stock.

- **Revenue Accuracy**: Never include `cancelled`, `failed`, or `pending` orders in dashboard revenue calculations.

- **Category UX**: Never implement category uploads without visual feedback (grayscale/progress).

- **Mobile Input Safety**: Do not use absolute buttons inside inputs on mobile viewports.

- **i18n Safety**: Never set a required constraint on an Arabic field (`*Ar`) in Mongoose; they must remain optional to support legacy data.

- **Floating Buttons**: Do not use floating Admin buttons on any public storefront page. Admin access must flow through `/profile`.

- **Server-Side Direction**: Do not rely exclusively on Zustand (`useLanguageStore`) for initial language detection in Server Components (like `layout.tsx`). You must read the `NEXT_LOCALE` cookie to set the HTML `dir` and `lang` attributes to prevent hydration mismatches.

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

- **Do not import `catalog.ts` in any page or component**: Legacy file for seed script only.

- **Clean Architecture Separation**: Bundles and Products MUST remain separated in the database (dedicated collections) and UI. Re-adding `isBundle` flags inside the `Product` model is STRICTLY FORBIDDEN.
