import { NextResponse } from 'next/server';
import { getSession } from '@/lib/portal/auth';
import {
  getClientProject,
  getProjectMilestones,
  getProjectMessages,
  getProjectFiles,
  getUnreadMessageCount,
  formatFileSize,
  formatDate,
} from '@/lib/portal/db';

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

    const milestones = await getProjectMilestones(project.id);
    const messages = await getProjectMessages(project.id);
    const files = await getProjectFiles(project.id);
    const unreadCount = await getUnreadMessageCount(project.id);

    return NextResponse.json({
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company,
      },
      project: {
        id: project.id,
        name: project.name,
        package: project.package,
        status: project.status,
        statusLabel: project.status_label,
        progress: project.progress,
        startDate: formatDate(project.start_date),
        estimatedEnd: formatDate(project.estimated_end),
        manager: project.manager,
        description: project.description,
      },
      milestones: milestones.map(m => ({
        id: m.id,
        title: m.title,
        status: m.status,
        date: m.date,
      })),
      messages: messages.map(m => ({
        id: m.id,
        from: m.sender_type === 'client' ? 'Sie' : m.sender_name,
        senderType: m.sender_type,
        text: m.message,
        time: formatMessageTime(m.created_at),
        unread: m.is_read === 0,
      })),
      files: files.map(f => ({
        id: f.id,
        name: f.original_name,
        size: formatFileSize(f.size),
        date: formatDate(f.created_at),
        type: getFileType(f.mime_type),
      })),
      unreadCount,
    });
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Heute, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Gestern, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('de-DE');
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
