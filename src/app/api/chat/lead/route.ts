import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, messages } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email required" },
        { status: 400 }
      );
    }

    // Extract conversation summary
    const conversationSummary = messages
      ?.slice(-10)
      .map((m: any) => `${m.role === "user" ? "User" : "Bot"}: ${m.content}`)
      .join("\n\n");

    // Save lead to Supabase
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name,
        email,
        phone: phone || null,
        source: "chat_widget",
        message: `Chat Conversation:\n\n${conversationSummary}`,
        status: "new",
        priority: "medium",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Send notification
    try {
      const { sendNotification } = await import("@/lib/notifications");
      await sendNotification({
        type: "lead",
        data: {
          name,
          email,
          phone,
          source: "Chat Widget 💬",
          message: conversationSummary?.substring(0, 500) || "Chat conversation",
        },
      });
    } catch (notifError) {
      console.error("Notification error:", notifError);
    }

    return NextResponse.json({
      success: true,
      leadId: data?.id,
    });
  } catch (error: any) {
    console.error("Chat lead error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save lead" },
      { status: 500 }
    );
  }
}
