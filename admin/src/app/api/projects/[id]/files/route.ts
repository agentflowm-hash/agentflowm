/**
 * Admin File Upload/List for Customer Projects
 * GET: List files for a project
 * POST: Upload file to customer project (admin side)
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError, NotFoundError } from '@/lib/api';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.txt', '.rtf', '.csv',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.zip', '.rar', '.7z',
];

// GET /api/projects/[id]/files
export const GET = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const projectId = request.nextUrl.pathname.split('/')[3];

  const { data: files, error } = await db
    .from('portal_files')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw new DatabaseError(error.message);

  return { files: files || [] };
});

// POST /api/projects/[id]/files
export const POST = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const projectId = request.nextUrl.pathname.split('/')[3];

  // Verify project exists
  const { data: project } = await db
    .from('portal_projects')
    .select('id')
    .eq('id', projectId)
    .single();

  if (!project) throw new NotFoundError('Projekt');

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) throw new DatabaseError('Keine Datei hochgeladen');

  // Sanitize filename
  const rawName = (file.name || 'file').replace(/[<>:"|?*\x00-\x1f]/g, '_').trim();
  const ext = rawName.slice(rawName.lastIndexOf('.')).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new DatabaseError(`Dateityp nicht erlaubt: ${ext}`);
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new DatabaseError('Datei zu gross (max. 10MB)');
  }

  // Upload to Supabase Storage
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);
  const timestamp = Date.now();
  const storagePath = `project_${projectId}/${timestamp}_${rawName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('portal-files')
    .upload(storagePath, fileBytes, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) throw new DatabaseError(`Upload fehlgeschlagen: ${uploadError.message}`);

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from('portal-files')
    .getPublicUrl(storagePath);

  // Save to DB
  const { data: newFile, error: dbError } = await db
    .from('portal_files')
    .insert({
      project_id: Number(projectId),
      name: rawName,
      url: urlData.publicUrl,
      size: file.size,
      type: file.type || 'application/octet-stream',
      uploaded_by: 'admin',
    })
    .select()
    .single();

  if (dbError) throw new DatabaseError(dbError.message);

  return { file: newFile };
});
