"use client";

import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { AuthProvider } from "@/lib/auth-context";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isLoginRoute = pathname === "/anmelden";

  if (isAdminRoute) {
    // Admin pages get no header/footer
    return <AuthProvider>{children}</AuthProvider>;
  }

  if (isLoginRoute) {
    // Login page - no header/footer
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <Header />
      <main id="main-content" className="min-h-screen" role="main">
        {children}
      </main>
      <Footer />
    </AuthProvider>
  );
}
