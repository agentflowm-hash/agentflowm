"use client";

import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { AuthProvider } from "@/lib/auth-context";
import { type Locale } from "@/i18n/config";

export default function LayoutWrapper({
  children,
  locale = "en",
}: {
  children: React.ReactNode;
  locale?: Locale;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isLoginRoute = pathname?.endsWith("/anmelden") || pathname === "/anmelden";

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
      <Header locale={locale} />
      <main id="main-content" className="min-h-screen" role="main">
        {children}
      </main>
      <Footer locale={locale} />
    </AuthProvider>
  );
}
