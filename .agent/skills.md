# 🎯 Odda Engineering Manifesto
**Status**: Lead Architect Verified (Alex)  
**Vision**: To build the most performant, secure, and resilient e-commerce engine for the Egyptian dental student niche.

---

## 🏗️ 1. Core Architecture: The "Atomic Serverless" Pattern
We leverage the **Next.js App Router** not just as a framework, but as an architectural boundary.

- **Server-First Mindset**: Use React Server Components (RSCs) by default. Client components are kept as "Islands of Interactivity" to minimize browser-side JS execution.
- **Server Actions**: All mutations happen via Server Actions. We treat actions as private RPC endpoints—validated, authenticated, and logged.
- **The 150-Line Rule**: No component file should exceed 150 lines. If it does, logic must be extracted into `...Parts/` sub-directories or custom hooks. This eliminates cognitive load and makes the codebase "Acquisition-Ready."
- **Atomic Styling**: We use **Tailwind CSS** with a strict design system. No ad-hoc hex codes; everything must use CSS variables defined in `src/app/globals.css`.

---

## 🔒 2. Zero-Trust Security Model
Trust is a vulnerability. Our architecture assumes every client request is potentially malicious.

- **Unified Validation (Zod)**: `src/lib/schemas.ts` is our Single Source of Truth. If it's not in the schema, it's not in the database.
- **DTOs (Data Transfer Objects)**: We never pass raw Mongoose documents to the client. We use strict mapping to strip internal metadata (`__v`, internal admin notes) and prevent sensitive data leaks.
- **Backend Price Integrity**: We **never** trust prices or totals from the frontend. The server re-fetches product data from MongoDB and calculates the final price during checkout.
- **Defense-in-Depth**: Implemented strict HTTP Security Headers (CSP, X-Frame-Options, STS) to mitigate XSS and Clickjacking at the protocol level.

---

## ⚡ 3. Performance & Free-Tier Resilience
We build for "Infinite Growth on Zero Budget."

- **Aggressive Caching**: We utilize `unstable_cache` with specific tags (`products-list`, `bundles-list`) for listing pages. This achieves sub-100ms Time-to-First-Byte (TTFB).
- **M0 Database Guard**: To survive on the MongoDB Free Tier (100 connection limit), we use a strict connection pooling pattern in `src/lib/mongodb.ts` with `maxPoolSize: 10` and `serverSelectionTimeoutMS: 5000`.
- **Cloudinary Native Pipeline**: We bypass Vercel's expensive Image Optimization API. By using a custom **Cloudinary Loader**, we offload all transformation math (`f_auto, q_auto`) to Cloudinary's free tier, ensuring we never hit Vercel's 1,000-image quota.

---

## 🌐 4. SEO & Internationalization (i18n) Mastery
We dominate the SERPs through technical precision.

- **Intent-Driven Metadata**: Our `generateMetadata` logic targets both branded entity keywords (**عُدّة**) and high-volume plain-text search intent (**عدة**).
- **Dynamic Structured Data**: Every Product and Bundle page automatically generates **JSON-LD Product Schema**, ensuring rich snippets (stars, price, stock) appear in search results.
- **100% RTL Logical Properties**: We avoid `left` and `right`. Our UI uses logical properties (`inset-s`, `ps`, `me`) to ensure a flawless experience for our primary Arabic-speaking audience while maintaining a bilingual-ready core.

---

## 📖 Onboarding Commandment
If you are reading this, you are expected to uphold these standards. Before submitting a PR:
1. Is it validated with Zod?
2. Is it sanitized with a DTO?
3. Is documented image usage offloaded to Cloudinary?
4. Is it under 150 lines?

**Engineered for Excellence. Built for Egypt.** 🇪🇬🛡️
