/**
 * ═══════════════════════════════════════════════════════════════
 *                    CLIENTS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  CreateClientSchema,
  ConflictError,
  DatabaseError,
  type CreateClientInput,
} from '@/lib/api';
import { logActivity } from '@/lib/activity';
import { notify } from '@/lib/notify';

// ─────────────────────────────────────────────────────────────────
// GET /api/clients - List all clients with projects
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async () => {
  const { data: clients, error } = await db
    .from('portal_clients')
    .select(`
      *,
      portal_projects (
        id,
        name,
        package,
        status,
        progress
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new DatabaseError(error.message);

  // Transform with unread message counts
  const clientsWithInfo = await Promise.all((clients || []).map(async (c: any) => {
    const project = c.portal_projects?.[0];
    let unread_messages = 0;

    if (project) {
      const { count } = await db
        .from('portal_messages')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id)
        .eq('is_read', false)
        .eq('sender_type', 'client');
      unread_messages = count || 0;
    }

    return {
      ...c,
      project_id: project?.id,
      project_name: project?.name,
      package: project?.package,
      project_status: project?.status,
      progress: project?.progress,
      unread_messages,
      portal_projects: undefined,
    };
  }));

  return { clients: clientsWithInfo };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/clients - Create new client
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateClientSchema,
}, async (data: CreateClientInput) => {
  const { name, email, company, phone, packageType } = data;

  // Check for existing email
  const { data: existing } = await db
    .from('portal_clients')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    throw new ConflictError('A client with this email already exists');
  }

  // Generate unique access code: PREFIX-0000
  const prefix = name.split(' ')[0].toUpperCase().slice(0, 4);
  let accessCode = '';
  let attempts = 0;

  while (attempts < 20) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    accessCode = `${prefix}-${randomNum}`;

    const { data: existingCode } = await db
      .from('portal_clients')
      .select('id')
      .eq('access_code', accessCode)
      .single();

    if (!existingCode) break;
    attempts++;
  }

  if (attempts >= 20) {
    throw new DatabaseError('Could not generate unique access code');
  }

  // Create client
  const { data: client, error: clientError } = await db
    .from('portal_clients')
    .insert({
      name,
      email,
      company: company || null,
      phone: phone || null,
      access_code: accessCode,
      status: 'active',
    })
    .select()
    .single();

  if (clientError) throw new DatabaseError(clientError.message);

  // Create project
  const { data: project, error: projectError } = await db
    .from('portal_projects')
    .insert({
      client_id: client.id,
      name: `Projekt ${name}`,
      package: packageType || 'Starter',
      status: 'planung',
      status_label: 'In Planung',
      progress: 0,
      manager: 'M. Ashaer',
    })
    .select()
    .single();

  if (projectError) throw new DatabaseError(projectError.message);

  // Welcome message
  await db.from('portal_messages').insert({
    project_id: project.id,
    sender_type: 'admin',
    sender_name: 'AgentFlow Team',
    message: 'Willkommen im Kundenportal! Hier können Sie den Fortschritt Ihres Projekts verfolgen.',
    is_read: false,
  });

  // Default milestones
  const milestones = [
    { title: 'Erstgespräch & Briefing', sort_order: 1 },
    { title: 'Konzept & Planung', sort_order: 2 },
    { title: 'Design-Entwurf', sort_order: 3 },
    { title: 'Entwicklung', sort_order: 4 },
    { title: 'Testing & Review', sort_order: 5 },
    { title: 'Go-Live', sort_order: 6 },
  ];

  await db.from('portal_milestones').insert(
    milestones.map((m) => ({
      project_id: project.id,
      title: m.title,
      status: 'pending',
      sort_order: m.sort_order,
    }))
  );

  await logActivity('client_created', 'client', client.id, name, { email, package: packageType });
  await notify('Neuer Kunde erstellt', `${name} wurde als Kunde angelegt`, 'success', '/clients');

  return {
    client: {
      id: client.id,
      name,
      email,
      accessCode,
      projectId: project.id,
    },
  };
});
