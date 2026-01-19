import { NextRequest, NextResponse } from "next/server";
import { validateAccessCode } from "@/lib/db";

// POST - Validate access code without logging in
// Used to check if a code is valid before showing login page
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const client = await validateAccessCode(code);

    if (!client) {
      return NextResponse.json({ valid: false }, { status: 404 });
    }

    // Code is valid - return success (without logging in)
    return NextResponse.json({
      valid: true,
      // Don't expose sensitive data, just confirm validity
    });
  } catch (error) {
    console.error("Validate error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
