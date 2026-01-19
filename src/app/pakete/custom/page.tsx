import { redirect } from "next/navigation";

// Enterprise/Custom Paket - Weiterleitung zu Termin
export default function CustomPackagePage() {
  redirect("/termin?paket=custom");
}
