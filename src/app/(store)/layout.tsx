import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/search/SearchModal";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <div className="flex-1 flex flex-col pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <SearchModal />
      <MobileMenu />
      <MobileBottomNav />
    </div>
  );
}
