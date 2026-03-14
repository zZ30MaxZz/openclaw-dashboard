'use server';

import { createDocument, updateDocument, deleteDocument, searchDocuments } from '@/lib/docs-store';
import { revalidatePath } from 'next/cache';

export async function createDocumentAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as 'guide' | 'api' | 'tutorial' | 'reference' | 'faq';
    const tags = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean);
    const content = formData.get('content') as string;
    const author = formData.get('author') as string || 'Unknown';

    const doc = createDocument({
      title,
      description,
      category,
      tags,
      content,
      author,
    });

    revalidatePath('/docs');
    return { success: true, doc };
  } catch (error) {
    console.error('Failed to create document:', error);
    return { success: false, error: 'Failed to create document' };
  }
}

export async function updateDocumentAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as 'guide' | 'api' | 'tutorial' | 'reference' | 'faq';
    const tags = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean);
    const content = formData.get('content') as string;

    const doc = updateDocument(id, {
      title,
      description,
      category,
      tags,
      content,
    });

    revalidatePath('/docs');
    return { success: true, doc };
  } catch (error) {
    console.error('Failed to update document:', error);
    return { success: false, error: 'Failed to update document' };
  }
}

export async function deleteDocumentAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    deleteDocument(id);
    revalidatePath('/docs');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete document:', error);
    return { success: false, error: 'Failed to delete document' };
  }
}

export async function searchDocumentsAction(formData: FormData) {
  try {
    const query = formData.get('query') as string;
    const results = searchDocuments(query);
    return { success: true, results };
  } catch (error) {
    console.error('Failed to search documents:', error);
    return { success: false, error: 'Failed to search documents', results: [] };
  }
}