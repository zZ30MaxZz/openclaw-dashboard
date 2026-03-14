'use server';

import { revalidatePath } from 'next/cache';
import {
  createContentItem,
  deleteContentItem,
  updateContentItem,
  ContentChannel,
  ContentPriority,
  ContentStatus,
} from '@/lib/content-store';

export async function createContentAction(formData: FormData) {
  const title = formData.get('title')?.toString().trim();
  if (!title) return;

  const brief = formData.get('brief')?.toString().trim() || 'Sin brief';
  const owner = formData.get('owner')?.toString().trim() || 'Mission Control';
  const channel = (formData.get('channel')?.toString() || 'blog') as ContentChannel;
  const priority = (formData.get('priority')?.toString() || 'medium') as ContentPriority;
  const dueDate = formData.get('dueDate')?.toString() || new Date().toISOString().split('T')[0];

  createContentItem({ title, brief, owner, channel, priority, dueDate });
  revalidatePath('/content');
}

export async function updateContentAction(formData: FormData) {
  const contentId = formData.get('contentId')?.toString();
  if (!contentId) return;

  const updates = {
    status: formData.get('status')?.toString() as ContentStatus | undefined,
    priority: formData.get('priority')?.toString() as ContentPriority | undefined,
    owner: formData.get('owner')?.toString() || undefined,
    artifactUrl: formData.get('artifactUrl')?.toString() || undefined,
  };

  updateContentItem(contentId, updates);
  revalidatePath('/content');
}

export async function deleteContentAction(formData: FormData) {
  const contentId = formData.get('contentId')?.toString();
  if (!contentId) return;

  deleteContentItem(contentId);
  revalidatePath('/content');
}
