import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db, Referral } from "@/lib/db";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: rows, error } = await db
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Transform snake_case to camelCase
    const referrals = (rows || []).map((row: Referral) => ({
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
