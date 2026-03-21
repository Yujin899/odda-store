import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from '@/components/ui/ToastContainer';
import { Providers } from '@/components/Providers';
import { ScrollToTop } from '@/components/shared/ScrollToTop';
import { cookies } from 'next/headers';
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

const inter = localFont({
  src: [
    { path: "../../public/fonts/inter/Inter_28pt-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/inter/Inter_28pt-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/inter/Inter_28pt-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/inter/Inter_28pt-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/inter/Inter_28pt-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/inter/Inter_28pt-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-inter",
  display: 'swap',
});

const cairo = localFont({
  src: [
    { path: "../../public/fonts/cairo/Cairo-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/cairo/Cairo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/cairo/Cairo-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/cairo/Cairo-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/cairo/Cairo-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/cairo/Cairo-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-cairo",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Odda | Premium Dental & Surgical Tools",
  description: "Precision clinical instruments engineered for excellence in modern healthcare.",
};

import { connectDB } from '@/lib/mongodb';
import { StoreSettings } from '@/models/StoreSettings';
import { generateThemeCSS, defaultTheme } from '@/lib/theme';

async function getStoreSettings() {
  try {
    await connectDB();
    let settings = await StoreSettings.findOne().lean();
    
    // Migration & Robustness check: Ensure all default theme fields exist
    if (settings && settings.theme) {
      let needsUpdate = false;
      const updatedTheme = { ...settings.theme };
      
      // Migrate old 'navy' to 'brandDark' if it exists
      if (settings.theme.navy && !settings.theme.brandDark) {
        updatedTheme.brandDark = settings.theme.navy;
        delete updatedTheme.navy;
        needsUpdate = true;
      }

      // Ensure all other default fields exist
      Object.keys(defaultTheme).forEach(key => {
        if (!(key in updatedTheme)) {
          updatedTheme[key] = (defaultTheme as any)[key];
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        settings = await StoreSettings.findOneAndUpdate(
          { _id: settings._id },
          { $set: { theme: updatedTheme } },
          { returnDocument: 'after' }
        ).lean();
      }
    }
    
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  } catch (error) {
    console.error('--- ERROR FETCHING SETTINGS ---', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const settings = await getStoreSettings();
  const themeCSS = generateThemeCSS(settings?.theme ?? defaultTheme);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className={`${inter.variable} ${cairo.variable} antialiased font-primary`}>
        <Providers>
          <ScrollToTop />
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
