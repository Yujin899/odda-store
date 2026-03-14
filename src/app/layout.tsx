import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from '@/components/ui/ToastContainer';
import { Providers } from '@/components/Providers';
import { cookies } from 'next/headers';
import type { Metadata } from "next";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} antialiased font-primary`}>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
