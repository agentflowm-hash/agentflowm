import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getClientProject, getProjectFiles, addFile, formatFileSize } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Dateien des Kunden-Projekts abrufen
export async function GET() {
  try {
    const client = await getSession();

    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await getClientProject(client.id);

    if (!project) {
      return NextResponse.json({ error: 'Kein Projekt gefunden' }, { status: 404 });
    }

    const files = await getProjectFiles(project.id);

    return NextResponse.json({
      files: files.map(f => ({
        id: f.id,
        name: f.name,
        size: formatFileSize(f.size || 0),
        sizeBytes: f.size || 0,
        date: new Date(f.created_at).toLocaleDateString('de-DE'),
        type: getFileType(f.type),
        uploadedBy: f.uploaded_by,
        url: f.url,
      })),
    });
  } catch (error) {
    console.error('Files fetch error:', error);
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}

// Erlaubte Dateitypen
const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.txt', '.rtf', '.csv',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.zip', '.rar', '.7z'
];

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain', 'text/csv', 'application/rtf',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'
];

function sanitizeFilename(filename: string): string {
  const name = filename.split(/[\\/]/).pop() || 'file';
  const sanitized = name
    .replace(/[\x00-\x1f\x80-\x9f]/g, '')
    .replace(/[<>:"|?*]/g, '_')
    .replace(/\.{2,}/g, '.')
    .trim();
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const ext = sanitized.slice(sanitized.lastIndexOf('.'));
    return sanitized.slice(0, maxLength - ext.length) + ext;
  }
  return sanitized || 'file';
}

// POST - Datei hochladen (Supabase Storage)
export async function POST(request: NextRequest) {
  try {
    const client = await getSession();

    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await getClientProject(client.id);

    if (!project) {
      return NextResponse.json({ error: 'Kein Projekt gefunden' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei hochgeladen' }, { status: 400 });
    }

    const sanitizedName = sanitizeFilename(file.name);
    const ext = sanitizedName.slice(sanitizedName.lastIndexOf('.')).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({
        error: `Dateityp nicht erlaubt. Erlaubt: ${ALLOWED_EXTENSIONS.join(', ')}`
      }, { status: 400 });
    }

    const mimeType = file.type || 'application/octet-stream';
    if (mimeType !== 'application/octet-stream' && !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: 'Dateityp nicht erlaubt' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Datei zu groß (max. 10MB)' }, { status: 400 });
    }

    // Datei-Bytes lesen
    const fileBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);

    // Supabase Storage: Pfad = portal-files/project_{id}/timestamp_name
    const timestamp = Date.now();
    const storagePath = `project_${project.id}/${timestamp}_${sanitizedName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('portal-files')
      .upload(storagePath, fileBytes, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 });
    }

    // Öffentliche URL generieren
    const { data: urlData } = supabaseAdmin.storage
      .from('portal-files')
      .getPublicUrl(storagePath);

    const fileUrl = urlData.publicUrl;

    // In Datenbank speichern
    const newFile = await addFile(
      project.id,
      sanitizedName,
      fileUrl,
      file.size,
      mimeType,
      'client'
    );

    return NextResponse.json({
      success: true,
      file: {
        id: newFile.id,
        name: newFile.name,
        size: formatFileSize(file.size),
        date: 'Gerade eben',
        type: getFileType(mimeType),
        url: newFile.url,
      },
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 });
  }
}

function getFileType(mimeType: string | null): string {
  if (!mimeType) return 'file';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('zip') || mimeType.includes('archive') || mimeType.includes('rar')) return 'archive';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
  return 'file';
}
