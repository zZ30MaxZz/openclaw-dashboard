'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createCollection, deleteCollection, injectContext, recordSearch } from '@/lib/memory-store';

export async function createCollectionAction(formData: FormData) {
  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim() || 'Sin descripción';
  const tagsRaw = formData.get('tags')?.toString() || '';
  if (!name) return;

  const tags = tagsRaw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  createCollection({ name, description, tags });
  revalidatePath('/memory');
}

export async function deleteCollectionAction(formData: FormData) {
  const collectionId = formData.get('collectionId')?.toString();
  if (!collectionId) return;

  deleteCollection(collectionId);
  revalidatePath('/memory');
}

export async function injectContextAction(formData: FormData) {
  const collectionId = formData.get('collectionId')?.toString();
  const topic = formData.get('topic')?.toString().trim() || 'Context update';
  const content = formData.get('content')?.toString().trim();
  if (!collectionId || !content) return;

  injectContext(collectionId, content, topic);
  revalidatePath('/memory');
}

export async function memorySearchAction(formData: FormData) {
  const query = formData.get('query')?.toString().trim();
  if (!query) return;

  recordSearch(query);
  redirect(`/memory?query=${encodeURIComponent(query)}`);
}
