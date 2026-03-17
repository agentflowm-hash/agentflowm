/**
 * ═══════════════════════════════════════════════════════════════
 *          VAULT SCAN — AI Image-to-Credentials Extraction
 * ═══════════════════════════════════════════════════════════════
 * Uses Groq Llama Vision to extract credentials from screenshots
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Kein Bild übermittelt' }, { status: 400 });
    }

    // Call Groq Llama Vision API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analysiere dieses Bild und extrahiere ALLE Zugangsdaten, Passwörter, URLs, Benutzernamen, API-Keys, Codes oder Links die du findest.

Antworte NUR mit einem JSON-Objekt in diesem Format (keine anderen Texte):
{
  "title": "Name/Titel des Dienstes (z.B. WordPress Admin, Hosting Panel)",
  "category": "login" oder "api_key" oder "link" oder "server" oder "snippet" oder "other",
  "url": "gefundene URL oder null",
  "username": "gefundener Benutzername/E-Mail oder null",
  "password": "gefundenes Passwort oder null",
  "notes": "zusätzliche Infos die du im Bild findest, z.B. Server-IP, Port, weitere Details",
  "snippet_code": "falls Code/Konfiguration gefunden, hier den Code, sonst null",
  "snippet_language": "programmiersprache falls code gefunden, sonst null"
}

Wenn du mehrere Zugänge findest, gib ein Array von solchen Objekten zurück.
Wenn du nichts findest, gib zurück: {"error": "Keine Zugangsdaten gefunden"}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: image.startsWith('data:') ? image : `data:image/png;base64,${image}`,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq API error:', err);
      return NextResponse.json({ error: 'AI-Erkennung fehlgeschlagen' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = (jsonMatch[1] || content).trim();
      const parsed = JSON.parse(jsonStr);

      if (parsed.error) {
        return NextResponse.json({ error: parsed.error }, { status: 404 });
      }

      // Normalize to array
      const results = Array.isArray(parsed) ? parsed : [parsed];

      return NextResponse.json({
        success: true,
        credentials: results,
        count: results.length,
      });
    } catch {
      // If JSON parsing fails, try to extract what we can
      return NextResponse.json({
        success: true,
        credentials: [{
          title: 'Gescannter Eintrag',
          category: 'other',
          notes: content,
          url: null,
          username: null,
          password: null,
        }],
        count: 1,
        raw: content,
      });
    }
  } catch (error) {
    console.error('Vault scan error:', error);
    return NextResponse.json({ error: 'Server-Fehler beim Scannen' }, { status: 500 });
  }
}
