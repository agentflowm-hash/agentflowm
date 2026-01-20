import { redirect } from "@/i18n/routing";
import { Locale } from "@/i18n/config";

// Kontakt page redirects to /termin
export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/termin", locale: locale as Locale });
}
