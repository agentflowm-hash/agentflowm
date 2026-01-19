import { redirect } from "next/navigation";

// Kontakt-Seite leitet zu /termin weiter
export default function KontaktPage() {
  redirect("/termin");
}
