"use client";

import { usePathname } from "next/navigation";
import Header from "../landing/Header";
import Footer from "../landing/Footer";
import { CartProvider } from "@/context/CartContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <>
      <CartProvider>
        {!isAuthPage && <Header />}
        <main className="w-full">{children}</main>
        {!isAuthPage && <Footer />}
      </CartProvider>
    </>
  );
}
