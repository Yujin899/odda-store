# Performance & Caching Rules
This file covers database optimization for free-tier survival, edge caching strategies, and asset optimization.

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
