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

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Datei zu groß (max. 10MB)' }, { status: 400 });
    }

    // In production, this would upload to Supabase Storage or similar
    // For now, just record the file info
    const fileUrl = `/uploads/${file.name}`; // Placeholder URL

    // Save to database
    const newFile = await addFile(
      project.id,
      file.name,
      fileUrl,
      file.size,
      file.type || 'application/octet-stream',
      'client'
    );

    return NextResponse.json({
      success: true,
      file: {
        id: newFile.id,
        name: newFile.name,
        size: formatFileSize(file.size),
        date: 'Gerade eben',
        type: getFileType(file.type),
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
