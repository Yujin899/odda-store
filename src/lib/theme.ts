export const defaultTheme = {
  primary: '#0073E6',
  primaryForeground: '#FFFFFF',
  secondary: '#F1F5F9',
  secondaryForeground: '#0A192F',
  accent: '#F8FAFC',
  accentForeground: '#0A192F',
  background: '#FFFFFF',
  foreground: '#0A192F',
  border: '#E2E8F0',
  radius: '0.5rem',
  brandDark: '#0A192F',
};

export type ThemeConfig = typeof defaultTheme;

/**
 * Converts HEX color to oklch string.
 * Used server-side for CSS injection in root layout.
 * Shadcn requires oklch format.
 */
export function hexToOklch(hex: string): string {
  try {
    const r = parseInt(hex.slice(1,3),16)/255;
    const g = parseInt(hex.slice(3,5),16)/255;
    const b = parseInt(hex.slice(5,7),16)/255;
    const toLinear = (c: number) => c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
    const lr = toLinear(r), lg = toLinear(g), lb = toLinear(b);
    const x = lr*0.4122214708 + lg*0.5363325363 + lb*0.0514459929;
    const y = lr*0.2119034982 + lg*0.6806995451 + lb*0.1073969566;
    const z = lr*0.0883024619 + lg*0.2817188376 + lb*0.6299787005;
    const l = Math.cbrt(x)*0.2104542553 + Math.cbrt(y)*0.7936177850 - Math.cbrt(z)*0.0040720468;
    const a = Math.cbrt(x)*1.9779984951 - Math.cbrt(y)*2.4285922050 + Math.cbrt(z)*0.4505937099;
    const bVal = Math.cbrt(x)*0.0259040371 + Math.cbrt(y)*0.7827717662 - Math.cbrt(z)*0.8086757660;
    const L = Math.max(0, l);
    const C = Math.sqrt(a*a + bVal*bVal);
    const H = Math.atan2(bVal, a) * (180/Math.PI);
    return `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${(H < 0 ? H+360 : H).toFixed(4)})`;
  } catch {
    return 'oklch(0.5 0.1 250)'; // safe fallback
  }
}

/**
 * Generates dynamic CSS variables string from theme config.
 * Server-side only — injected into <head> by root layout.
 * Uses oklch format required by Shadcn.
 */
export function generateThemeCSS(theme: Partial<ThemeConfig>): string {
  // Safe merge: only take defined values from the provided theme
  const t = { ...defaultTheme };
  if (theme) {
    (Object.keys(theme) as Array<keyof ThemeConfig>).forEach(key => {
      if (theme[key] !== undefined && theme[key] !== null) {
        t[key] = theme[key] as string;
      }
    });
  }

  return `:root {
    --primary: ${hexToOklch(t.primary)} !important;
    --primary-foreground: ${hexToOklch(t.primaryForeground)} !important;
    --secondary: ${hexToOklch(t.secondary)} !important;
    --secondary-foreground: ${hexToOklch(t.secondaryForeground)} !important;
    --accent: ${hexToOklch(t.accent)} !important;
    --accent-foreground: ${hexToOklch(t.accentForeground)} !important;
    --background: ${hexToOklch(t.background)} !important;
    --foreground: ${hexToOklch(t.foreground)} !important;
    --card: ${hexToOklch(t.background)} !important;
    --card-foreground: ${hexToOklch(t.foreground)} !important;
    --popover: ${hexToOklch(t.background)} !important;
    --popover-foreground: ${hexToOklch(t.foreground)} !important;
    --border: ${hexToOklch(t.border)} !important;
    --input: ${hexToOklch(t.border)} !important;
    --ring: ${hexToOklch(t.primary)} !important;
    --radius: ${t.radius} !important;
    --brand-dark: ${hexToOklch(t.brandDark)} !important;
  }`;
}

/**
 * Generates CSS variables using HEX directly.
 * Client-side only — used for live preview in ThemeTab.
 * NOT used for actual site rendering.
 */
export function generatePreviewCSS(theme: Partial<ThemeConfig>): string {
  const t = { ...defaultTheme, ...theme };
  return `:root {
    --primary: ${t.primary} !important;
    --primary-foreground: ${t.primaryForeground} !important;
    --secondary: ${t.secondary} !important;
    --secondary-foreground: ${t.secondaryForeground} !important;
    --accent: ${t.accent} !important;
    --accent-foreground: ${t.accentForeground} !important;
    --background: ${t.background} !important;
    --foreground: ${t.foreground} !important;
    --card: ${t.background} !important;
    --card-foreground: ${t.foreground} !important;
    --popover: ${t.background} !important;
    --popover-foreground: ${t.foreground} !important;
    --border: ${t.border} !important;
    --input: ${t.border} !important;
    --ring: ${t.primary} !important;
    --radius: ${t.radius} !important;
    --brand-dark: ${t.brandDark} !important;
  }`;
}
