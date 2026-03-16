# Security & Auth Rules
This file covers Zero-Trust principles, PII shielding, RBAC gatekeeping, and mandatory security forbidden rules.

## 5. Zero-Trust Security & PII Shielding

We operate under a "Zero-Trust" model where the backend is the only source of truth and data leakage is a critical failure.

- **DTO-First Response Pattern**: We **never** leak raw database structures. Every API response and server action must pass through a Data Transfer Object (DTO) layer or a strict `.map()` cleanup that:

    - Flattens `_id` into a string.

    - Strips raw Mongoose metadata like `__v`.

    - Sanitizes PII (Personally Identifiable Information) by returning only the fields required for the specific UI view.

- **Backend Price Integrity**: We **never** trust prices or subtotals sent from the client. The server re-fetches product data directly from MongoDB during checkout to calculate the final price.

- **PII Lockdown**: For customer-facing lists (Reviews, Public Tracking), we strip sensitive details (email, phone, internal notes) at the database projection level.

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

## Mandatory Security Forbidden Rules

- **ABSOLUTE BAN on Raw Document Returns**: Do not return raw Mongoose documents (objects with `_id` as an object, `__v`, or internal methods) to the client. This is a primary source of hydration errors and security leaks. Every response MUST be sanitized via DTO or `.map()`.

- **DTO Rule**: NEVER return raw Mongoose documents from an API. You MUST use the mandatory `.map()` or DTO pattern to flatten ObjectIds into strings and strip raw metadata (`__v`) or internal admin notes. This prevents PII (Personally Identifiable Information) leakage.

- **Mongoose Serialization**: Never pass raw Mongoose documents to Client Components. Even with `.lean()`, sub-documents in arrays (like `images`) can contain `_id` buffers. Always map to strictly plain objects first.

- **Security Rule**: NEVER bypass `auth()` checks on sensitive APIs like `GET /api/orders`. All administrative data access must strictly verify the 'admin' role.

- **No Self-Sabotage**: Admins cannot block, demote, or delete their own accounts.

- **AI Backend**: Do not install or use `@google/generative-ai` or OpenAI SDKs in the backend API.

- **Do not hardcode Order IDs in emails**: Inject `newOrder._id.toString()` dynamically.

- **Email Redundancy**: Never implement or trigger a "Delivered" email template. This is redundant and wastes Resend free-tier quota.

- **Do not send notification emails to admins**: Use the dashboard bell system to save Resend quota.
