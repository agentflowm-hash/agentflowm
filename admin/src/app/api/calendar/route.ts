import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Alle Kalender-Events
export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const type = searchParams.get("type"); // deadline, meeting, reminder, milestone

    let query = db.from("portal_calendar_events").select(`
      *,
      project:portal_projects(id, name, client_id),
      client:portal_clients(id, name, email, company)
    `);

    if (start) {
      query = query.gte("start_date", start);
    }
    if (end) {
      query = query.lte("start_date", end);
    }
    if (type) {
      query = query.eq("type", type);
    }

    const { data: events, error } = await query.order("start_date", { ascending: true });

    if (error) {
      console.error("Calendar GET error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Also get project deadlines
    const { data: projects } = await db
      .from("portal_projects")
      .select("id, name, estimated_end, client_id, status")
      .not("estimated_end", "is", null)
      .neq("status", "abgeschlossen");

    // Convert project deadlines to events
    const deadlineEvents = (projects || []).map(p => ({
      id: `deadline-${p.id}`,
      title: `📅 Deadline: ${p.name}`,
      start_date: p.estimated_end,
      type: "deadline",
      project_id: p.id,
      color: "#FC682C",
      all_day: true,
    }));

    return NextResponse.json({ 
      events: [...(events || []), ...deadlineEvents],
      count: (events?.length || 0) + deadlineEvents.length
    });
  } catch (error) {
    console.error("Calendar GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST - Neues Event erstellen
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      start_date, 
      end_date, 
      type, 
      project_id, 
      client_id,
      color,
      all_day,
      reminder_minutes,
      location,
      attendees
    } = body;

    if (!title || !start_date) {
      return NextResponse.json({ error: "Title and start_date required" }, { status: 400 });
    }

    const { data: event, error } = await db
      .from("portal_calendar_events")
      .insert({
        title,
        description: description || null,
        start_date,
        end_date: end_date || start_date,
        type: type || "event",
        project_id: project_id || null,
        client_id: client_id || null,
        color: color || "#FC682C",
        all_day: all_day || false,
        reminder_minutes: reminder_minutes || 30,
        location: location || null,
        attendees: attendees || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Calendar POST error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Calendar POST error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
