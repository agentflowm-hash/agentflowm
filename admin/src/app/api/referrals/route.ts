import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

interface ReferralRow {
  id: number;
  referrer_name: string;
  referrer_email: string;
  referrer_phone: string | null;
  referred_name: string;
  referred_email: string;
  referred_phone: string | null;
  referred_company: string | null;
  context: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getSqliteDb();
    const rows = db
      .prepare("SELECT * FROM referrals ORDER BY created_at DESC LIMIT 100")
      .all() as ReferralRow[];

    // Transform snake_case to camelCase
    const referrals = rows.map((row) => ({
      id: row.id,
      referrerName: row.referrer_name,
      referrerEmail: row.referrer_email,
      referrerPhone: row.referrer_phone,
      referredName: row.referred_name,
      referredEmail: row.referred_email,
      referredPhone: row.referred_phone,
      referredCompany: row.referred_company,
      message: row.context,
      notes: row.notes,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ referrals });
  } catch (error) {
    console.error("Referrals error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
