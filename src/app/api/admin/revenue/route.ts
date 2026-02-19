import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

// Check admin auth
async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === process.env.ADMIN_SESSION_SECRET;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all payments
    const { data: payments, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate stats
    let totalRevenue = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;
    const packageRevenue: Record<string, { revenue: number; count: number }> = {};

    (payments || []).forEach((payment) => {
      const amount = payment.amount || 0;
      const createdAt = new Date(payment.created_at);
      const packageName = payment.package_name || "Unknown";

      totalRevenue += amount;

      if (createdAt >= weekAgo) {
        weeklyRevenue += amount;
      }
      if (createdAt >= monthAgo) {
        monthlyRevenue += amount;
      }

      if (!packageRevenue[packageName]) {
        packageRevenue[packageName] = { revenue: 0, count: 0 };
      }
      packageRevenue[packageName].revenue += amount;
      packageRevenue[packageName].count += 1;
    });

    const revenueByPackage = Object.entries(packageRevenue).map(([pkg, data]) => ({
      package: pkg,
      revenue: data.revenue / 100, // Convert cents to euros
      count: data.count,
    }));

    return NextResponse.json({
      totalRevenue: totalRevenue / 100,
      weeklyRevenue: weeklyRevenue / 100,
      monthlyRevenue: monthlyRevenue / 100,
      payments: payments || [],
      revenueByPackage,
    });
  } catch (error: any) {
    console.error("Revenue fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
