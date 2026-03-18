/**
 * AI Leistungsbeschreibung Generator via Groq
 */
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { package_name, client_name, client_company, custom_prompt } = await request.json();

  if (!package_name && !custom_prompt) {
    return NextResponse.json({ error: 'Paketname oder Prompt erforderlich' }, { status: 400 });
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) return NextResponse.json({ error: 'Groq API nicht konfiguriert' }, { status: 500 });

  const prompt = custom_prompt || `Erstelle eine professionelle Leistungsbeschreibung für ein Angebot einer Webdesign-/Marketing-Agentur.

Paket: ${package_name}
${client_name ? `Kunde: ${client_name}` : ''}
${client_company ? `Firma: ${client_company}` : ''}

Die Beschreibung soll:
- Als einzelne Position für ein Angebot formuliert sein
- Professionell und verkaufsfördernd klingen
- Die wichtigsten Leistungen auflisten
- Auf Deutsch sein
- Maximal 3-4 Sätze + Aufzählungspunkte

Antworte NUR mit der Leistungsbeschreibung, ohne Einleitung oder Erklärung.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: 'AI-Fehler' }, { status: 500 });

    const data = await res.json();
    const description = data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ description });
  } catch {
    return NextResponse.json({ error: 'AI nicht erreichbar' }, { status: 500 });
  }
}
