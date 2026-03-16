# Design System Rules
This file covers CSS variables, typography, mobile-first design, and RTL logical properties.

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
