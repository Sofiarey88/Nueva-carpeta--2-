import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import HeaderCart from "@/app/components/HeaderCart";
import { CartProvider } from "@/app/CartProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tienda Demo",
  description: "Storefront y panel administrador con Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasAdminSession = cookieStore.get("admin_session")?.value === "1";
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8fafc]`}>
        <CartProvider>
          <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-400 px-2 py-1 text-xs font-bold text-slate-900">TIENDA</span>
                <span className="text-slate-600">Demo productos</span>
              </div>
              <div className="flex items-center gap-4">
                <nav className="flex gap-3">
                  <Link className="rounded-full px-3 py-1 transition hover:bg-amber-100" href="/">
                    Store
                  </Link>
                  {hasAdminSession && (
                    <Link className="rounded-full px-3 py-1 transition hover:bg-amber-100" href="/admin">
                      Admin
                    </Link>
                  )}
                </nav>
                <HeaderCart />
              </div>
            </div>
          </header>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
