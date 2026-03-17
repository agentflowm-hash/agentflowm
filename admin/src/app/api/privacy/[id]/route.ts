import { db } from '@/lib/db';
import { createHandler, DatabaseError, NotFoundError } from '@/lib/api';

// PATCH — update document, request, or processing
export const PATCH = createHandler({ auth: true }, async (data: any, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const type = data._type || 'document';

  if (type === 'request') {
    const updateData: Record<string, unknown> = {};
    if (data.status) {
      updateData.status = data.status;
      if (data.status === 'completed') updateData.completed_at = new Date().toISOString();
    }
    if (data.notes !== undefined) updateData.notes = data.notes;
    const { data: req, error } = await db.from('privacy_requests').update(updateData).eq('id', id).select().single();
    if (error) throw new DatabaseError(error.message);
    return { request: req };
  }

  if (type === 'processing') {
    const { _type, ...rest } = data;
    const { data: proc, error } = await db.from('privacy_processing').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new DatabaseError(error.message);
    return { processing: proc };
  }

  // Document
  const { _type, ...rest } = data;
  const { data: doc, error } = await db.from('privacy_documents').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw new DatabaseError(error.message);
  return { document: doc };
});

// DELETE
export const DELETE = createHandler({ auth: true }, async (data: any, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const type = request.nextUrl.searchParams.get('type') || 'document';
  const table = type === 'request' ? 'privacy_requests' : type === 'processing' ? 'privacy_processing' : 'privacy_documents';
  const { error } = await db.from(table).delete().eq('id', id);
  if (error) throw new DatabaseError(error.message);
  return { deleted: true };
});
