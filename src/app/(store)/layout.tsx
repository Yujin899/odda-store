import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/search/SearchModal";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { AdminFloatingButton } from "@/components/layout/AdminFloatingButton";
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <MobileMenu />
      <AdminFloatingButton />
    </div>
  );
}
