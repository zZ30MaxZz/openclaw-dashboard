'use server';

import { createDocument, updateDocument, deleteDocument } from '@/lib/docs-store';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDocumentAction(formData: FormData) {
  try {
    const title = formData.get('title')?.toString().trim();
    if (!title) return;

    const description = formData.get('description')?.toString().trim() || 'Sin descripción';
    const category = (formData.get('category')?.toString() || 'guide') as 'guide' | 'api' | 'tutorial' | 'reference' | 'faq';
    const tags = (formData.get('tags')?.toString() || '').split(',').map((t) => t.trim()).filter(Boolean);
    const content = formData.get('content')?.toString() || '';
    const author = formData.get('author')?.toString().trim() || 'Unknown';

    createDocument({
      title,
      description,
      category,
      tags,
      content,
      author,
    });

    revalidatePath('/docs');
  } catch (error) {
    console.error('Failed to create document:', error);
  }
}

export async function updateDocumentAction(formData: FormData) {
  try {
    const id = formData.get('id')?.toString();
    const title = formData.get('title')?.toString().trim();
    if (!id || !title) return;

    const description = formData.get('description')?.toString().trim() || 'Sin descripción';
    const category = (formData.get('category')?.toString() || 'guide') as 'guide' | 'api' | 'tutorial' | 'reference' | 'faq';
    const tags = (formData.get('tags')?.toString() || '').split(',').map((t) => t.trim()).filter(Boolean);
    const content = formData.get('content')?.toString() || '';

    updateDocument(id, {
      title,
      description,
      category,
      tags,
      content,
    });

    revalidatePath('/docs');
  } catch (error) {
    console.error('Failed to update document:', error);
  }
}

export async function deleteDocumentAction(formData: FormData) {
  try {
    const id = formData.get('id')?.toString();
    if (!id) return;

    deleteDocument(id);
    revalidatePath('/docs');
  } catch (error) {
    console.error('Failed to delete document:', error);
  }
}

export async function searchDocumentsAction(formData: FormData) {
  try {
    const query = formData.get('query')?.toString().trim();
    if (!query) {
      redirect('/docs');
    }

    redirect(`/docs?query=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error('Failed to search documents:', error);
  }
}
