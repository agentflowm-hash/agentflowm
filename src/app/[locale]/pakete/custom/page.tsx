import { redirect } from "@/i18n/routing";
import { Locale } from "@/i18n/config";

// Enterprise/Custom Package - Redirect to appointment
export default async function CustomPackagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/termin?paket=custom", locale: locale as Locale });
}
