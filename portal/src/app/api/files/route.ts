import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getClientProject, getProjectFiles, addFile, formatFileSize } from '@/lib/db';

// GET - Get files for client's project
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

// Allowed file extensions (whitelist)
const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.txt', '.rtf', '.csv',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.zip', '.rar', '.7z'
];

// Allowed MIME types
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

// Sanitize filename to prevent path traversal and other attacks
function sanitizeFilename(filename: string): string {
  // Remove path components
  const name = filename.split(/[\\/]/).pop() || 'file';
  // Remove null bytes and other dangerous characters
  const sanitized = name
    .replace(/[\x00-\x1f\x80-\x9f]/g, '')
    .replace(/[<>:"|?*]/g, '_')
    .replace(/\.{2,}/g, '.')
    .trim();
  // Limit length
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const ext = sanitized.slice(sanitized.lastIndexOf('.'));
    return sanitized.slice(0, maxLength - ext.length) + ext;
  }
  return sanitized || 'file';
}

// POST - Upload file (placeholder - actual upload would need storage service)
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

    // Sanitize filename
    const sanitizedName = sanitizeFilename(file.name);

    // Validate file extension
    const ext = sanitizedName.slice(sanitizedName.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({
        error: `Dateityp nicht erlaubt. Erlaubt: ${ALLOWED_EXTENSIONS.join(', ')}`
      }, { status: 400 });
    }

    // Validate MIME type
    const mimeType = file.type || 'application/octet-stream';
    if (mimeType !== 'application/octet-stream' && !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({
        error: 'Dateityp nicht erlaubt'
      }, { status: 400 });
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Datei zu groß (max. 10MB)' }, { status: 400 });
    }

    // Generate safe filename with timestamp to avoid collisions
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${sanitizedName}`;

    // In production, this would upload to Supabase Storage or similar
    // For now, just record the file info
    const fileUrl = `/uploads/${safeFilename}`; // Placeholder URL

    // Save to database
    const newFile = await addFile(
      project.id,
      sanitizedName, // Store original (sanitized) name for display
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
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'archive';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
  return 'file';
}
