import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StoreLayoutClient } from "@/components/layout/StoreLayoutClient";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreLayoutClient
      navbar={<Navbar />}
      footer={<Footer />}
    >
      {children}
    </StoreLayoutClient>
  );
}
