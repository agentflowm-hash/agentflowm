import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getClientProject, getProjectFiles } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// GET - Get files for client's project
export async function GET() {
  try {
    const client = await getSession();

    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = getClientProject(client.id);

    if (!project) {
      return NextResponse.json({ error: 'Kein Projekt gefunden' }, { status: 404 });
    }

    const files = getProjectFiles(project.id);

    return NextResponse.json({
      files: files.map(f => ({
        id: f.id,
        name: f.original_name,
        size: formatFileSize(f.size),
        sizeBytes: f.size,
        date: new Date(f.created_at).toLocaleDateString('de-DE'),
        type: getFileType(f.mime_type),
        uploadedBy: f.uploaded_by,
      })),
    });
  } catch (error) {
    console.error('Files fetch error:', error);
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}

// POST - Upload file
export async function POST(request: NextRequest) {
  try {
    const client = await getSession();

    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = getClientProject(client.id);

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

    // Generate unique filename
    const ext = path.extname(file.name);
    const uniqueName = `${crypto.randomBytes(8).toString('hex')}${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), '..', 'uploads', `project_${project.id}`);
    await mkdir(uploadsDir, { recursive: true });

    // Save file
    const filePath = path.join(uploadsDir, uniqueName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Import db function here to avoid circular deps
    const { addFile } = await import('@/lib/db');

    // Save to database
    const newFile = addFile(
      project.id,
      uniqueName,
      file.name,
      file.size,
      file.type || 'application/octet-stream',
      'client'
    );

    return NextResponse.json({
      success: true,
      file: {
        id: newFile.id,
        name: file.name,
        size: formatFileSize(file.size),
        date: 'Gerade eben',
        type: getFileType(file.type),
      },
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 });
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileType(mimeType: string | null): string {
  if (!mimeType) return 'file';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'archive';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
  return 'file';
}
