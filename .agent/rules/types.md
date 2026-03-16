# TypeScript Type System Guide
This file covers the two-layer type architecture and rules for avoiding 'any'.

## Two-Layer Type Architecture
- `src/types/models.ts` — Server-side Mongoose document types
- `src/types/store.ts` — Client-side DTO types

## Rule
- API routes import from `models.ts`
- Components import from `store.ts`
- Never use `any` without `// eslint-disable-next-line @typescript-eslint/no-explicit-any` + explanation

## Available Types
### models.ts
- `ProductDoc`, `CategoryDoc`, `BundleDoc`, `OrderDoc`, `UserDoc`, `BadgeDoc`, `ReviewDoc`

### store.ts
- `Product`, `Bundle`, `Category`, `Badge`, `Order`, `OrderItem`, `ProductImage`, `Review`
