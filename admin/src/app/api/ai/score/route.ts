/**
 * AI Lead-Scoring via Groq
 * POST: Analysiert Lead-Daten und gibt Score + Empfehlung
 */

import { createHandler, DatabaseError } from '@/lib/api';

export const POST = createHandler({ auth: true }, async (data) => {
  const { name, email, company, phone, source, package_interest, budget, message } = data as any;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new DatabaseError('GROQ_API_KEY nicht konfiguriert');

  const prompt = `Du bist ein Sales-Experte fuer eine Webdesign-Agentur (AgentFlowMarketing).
Analysiere diesen Lead und gib einen Score von 0-100 sowie eine kurze Empfehlung.

Lead-Daten:
- Name: ${name || 'Unbekannt'}
- E-Mail: ${email || '-'}
- Firma: ${company || 'Nicht angegeben'}
- Telefon: ${phone || 'Nicht angegeben'}
- Quelle: ${source || 'Website'}
- Paket-Interesse: ${package_interest || 'Nicht angegeben'}
- Budget: ${budget || 'Nicht angegeben'}
- Nachricht: ${message || 'Keine'}

Bewertungskriterien:
- Vollstaendigkeit der Daten (E-Mail + Telefon + Firma = hoch)
- Budget angegeben = sehr positiv
- Paket-Interesse = Kaufabsicht
- Firmenname vorhanden = B2B (hoeher)
- Nachricht geschrieben = engagiert

Antworte NUR im folgenden JSON-Format, keine andere Ausgabe:
{"score": NUMBER, "label": "hot|warm|cold", "reason": "Kurze Begruendung auf Deutsch", "nextAction": "Empfohlene naechste Aktion auf Deutsch"}`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!res.ok) throw new Error(`Groq API Error: ${res.status}`);

    const result = await res.json();
    const text = result.choices?.[0]?.message?.content || '';

    // Parse JSON aus der Antwort
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Kein JSON in Antwort');

    const scoring = JSON.parse(jsonMatch[0]);

    return {
      score: Math.min(100, Math.max(0, scoring.score || 0)),
      label: scoring.label || 'warm',
      reason: scoring.reason || '',
      nextAction: scoring.nextAction || '',
    };
  } catch (err: any) {
    throw new DatabaseError(`AI-Scoring fehlgeschlagen: ${err.message}`);
  }
});
