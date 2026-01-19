import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM LOGIN FOR PORTAL
// Nur für bestehende Kunden - keine neuen Accounts!
// ═══════════════════════════════════════════════════════════════

const db = supabaseAdmin;

// Generiere Session Token
function generateToken(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code fehlt" }, { status: 400 });
    }

    const cleanCode = code.replace(/\D/g, "");

    if (cleanCode.length !== 6) {
      return NextResponse.json(
        { error: "Code muss 6 Ziffern haben" },
        { status: 400 },
      );
    }

    // Prüfe Login-Code
    const { data: loginCode, error: loginCodeError } = await db
      .from("login_codes")
      .select("*")
      .eq("code", cleanCode)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (loginCodeError || !loginCode) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json(
        { error: "Code ungültig oder abgelaufen" },
        { status: 401 },
      );
    }

    // Markiere als verwendet
    await db
      .from("login_codes")
      .update({ used: true })
      .eq("id", loginCode.id);

    // Prüfe ob Client existiert - NUR bestehende Kunden erlaubt!
    const { data: client, error: clientError } = await db
      .from("portal_clients")
      .select("*")
      .ilike("telegram_username", loginCode.telegram_username)
      .single();

    if (clientError || !client) {
      // Kein Account gefunden - Fehlermeldung
      return NextResponse.json(
        {
          error: "Kein Kundenaccount gefunden",
          message:
            "Für diesen Telegram-Account existiert kein Kundenportal-Zugang. Bitte kontaktieren Sie uns, um Kunde zu werden.",
          noAccount: true,
        },
        { status: 403 },
      );
    }

    // Prüfe ob Client ein Projekt hat
    const { data: project, error: projectError } = await db
      .from("portal_projects")
      .select("id")
      .eq("client_id", client.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        {
          error: "Kein aktives Projekt",
          message:
            "Ihr Kundenportal wird gerade eingerichtet. Bitte versuchen Sie es später erneut.",
          noProject: true,
        },
        { status: 403 },
      );
    }

    // Update last_login und Telegram-Daten
    await db
      .from("portal_clients")
      .update({
        last_login: new Date().toISOString(),
        telegram_id: client.telegram_id || loginCode.telegram_id,
      })
      .eq("id", client.id);

    // Erstelle Session
    const token = generateToken();

    // Lösche alte Sessions
    await db
      .from("portal_sessions")
      .delete()
      .eq("client_id", client.id);

    // Neue Session - 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db
      .from("portal_sessions")
      .insert({
        client_id: client.id,
        token: token,
        expires_at: expiresAt.toISOString(),
      });

    console.log(
      `✅ Portal login via Telegram: @${loginCode.telegram_username} (Client: ${client.name})`,
    );

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set("portal_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      path: "/",
    });

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        username: loginCode.telegram_username,
        accessCode: client.access_code,
      },
    });
  } catch (error) {
    console.error("Telegram login error:", error);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
