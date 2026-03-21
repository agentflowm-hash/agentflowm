/**
 * ═══════════════════════════════════════════════════════════════
 *                    LEADS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  CreateLeadSchema,
  ConflictError,
  DatabaseError,
  type CreateLeadInput,
} from '@/lib/api';
import nodemailer from 'nodemailer';
import { logActivity } from '@/lib/activity';
import { n8nLeadWelcome } from '@/lib/n8n';

// ─────────────────────────────────────────────────────────────────
// GET /api/leads - List all leads
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const source = searchParams.get('source');

  let query = db
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }
  if (source) {
    query = query.eq('source', source);
  }

  const { data: leads, error } = await query;

  if (error) throw new DatabaseError(error.message);

  // Get counts by status
  const { data: statusCounts } = await db
    .from('leads')
    .select('status')
    .then(({ data }) => {
      const counts: Record<string, number> = {};
      (data || []).forEach((l: any) => {
        counts[l.status] = (counts[l.status] || 0) + 1;
      });
      return { data: counts };
    });

  return {
    leads: leads || [],
    counts: statusCounts || {},
  };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/leads - Create new lead (can be public)
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: false, // Public endpoint for contact forms
  schema: CreateLeadSchema,
  rateLimit: { requests: 5, windowMs: 60 * 1000 }, // 5 pro Minute
}, async (data: CreateLeadInput) => {
  const { name, email, company, phone, message, source, package_interest, referrer_id } = data;

  // Check for duplicate email in last 24h (prevent spam)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: recent } = await db
    .from('leads')
    .select('id')
    .eq('email', email)
    .gte('created_at', oneDayAgo)
    .single();

  if (recent) {
    throw new ConflictError('A request with this email was submitted recently');
  }

  const { data: lead, error } = await db
    .from('leads')
    .insert({
      name,
      email,
      company: company || null,
      phone: phone || null,
      message: message || null,
      source: source || 'website',
      package_interest: package_interest || null,
      referrer_id: referrer_id || null,
      status: 'new',
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  // Create notification for new lead
  await db.from('notifications').insert({
    title: 'Neue Anfrage',
    message: `${name} hat eine Anfrage gesendet`,
    type: 'info',
    link: `/leads/${lead.id}`,
    read: false,
  });

  // Empfehlungsgeber: Counter erhöhen + Dankes-E-Mail senden
  if (referrer_id) {
    // Referrer-Counter aktualisieren
    const { data: referrer } = await db
      .from('referrers')
      .select('id, name, email, total_referrals')
      .eq('id', referrer_id)
      .single();

    if (referrer) {
      await db
        .from('referrers')
        .update({
          total_referrals: (referrer.total_referrals || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', referrer_id);

      // Dankes-E-Mail direkt senden
      if (process.env.SMTP_HOST) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          });
          const firstName = referrer.name.split(' ')[0];
          await transporter.sendMail({
            from: `AgentFlowMarketing <${process.env.EMAIL_FROM || 'kontakt@agentflowm.de'}>`,
            to: referrer.email,
            subject: `Danke für deine Empfehlung, ${firstName}!`,
            html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#111827;color:#fff;border-radius:16px;">
              <h2 style="color:#FC682C;margin:0 0 16px;">Danke für deine Empfehlung!</h2>
              <p>Hallo ${firstName},</p>
              <p style="color:rgba(255,255,255,0.7);">vielen Dank, dass du <strong>${name}</strong> an uns empfohlen hast! Wir setzen uns zeitnah mit ${name} in Verbindung.</p>
              <p style="color:rgba(255,255,255,0.7);">Sobald ein Projekt zustande kommt, erhältst du deine <strong style="color:#FC682C;">10% Empfehlungsprovision</strong>.</p>
              <p style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:24px;">Beste Grüße,<br>Das AgentFlowMarketing Team</p>
            </div>`,
          });
        } catch (emailErr) {
          console.error('Dankes-E-Mail Fehler:', emailErr);
        }
      }
    }
  }

  await logActivity('lead_created', 'lead', lead.id, name, { source, email });

  // Fire n8n webhook for welcome email
  n8nLeadWelcome({ name, email, phone, package_interest, company });

  return { lead };
});
