'use server';

import { revalidatePath } from 'next/cache';
import {
  createFeedback,
  deleteFeedback,
  FeedbackCategory,
  FeedbackPriority,
  FeedbackSentiment,
  FeedbackStatus,
  updateFeedback,
  voteFeedback,
} from '@/lib/feedback-store';

export async function createFeedbackAction(formData: FormData) {
  const title = formData.get('title')?.toString().trim();
  const description = formData.get('description')?.toString().trim() || 'Sin detalles';
  const reporter = formData.get('reporter')?.toString().trim() || 'Anónimo';
  const category = (formData.get('category')?.toString() || 'feature') as FeedbackCategory;
  const sentiment = (formData.get('sentiment')?.toString() || 'neutral') as FeedbackSentiment;
  const priority = (formData.get('priority')?.toString() || 'medium') as FeedbackPriority;
  if (!title) return;

  createFeedback({ title, description, reporter, category, sentiment, priority });
  revalidatePath('/feedback');
}

export async function updateFeedbackAction(formData: FormData) {
  const feedbackId = formData.get('feedbackId')?.toString();
  if (!feedbackId) return;

  const updates = {
    status: formData.get('status')?.toString() as FeedbackStatus | undefined,
    priority: formData.get('priority')?.toString() as FeedbackPriority | undefined,
    assignedTo: formData.get('assignedTo')?.toString() || undefined,
  };

  updateFeedback(feedbackId, updates);
  revalidatePath('/feedback');
}

export async function voteFeedbackAction(formData: FormData) {
  const feedbackId = formData.get('feedbackId')?.toString();
  if (!feedbackId) return;

  voteFeedback(feedbackId);
  revalidatePath('/feedback');
}

export async function deleteFeedbackAction(formData: FormData) {
  const feedbackId = formData.get('feedbackId')?.toString();
  if (!feedbackId) return;

  deleteFeedback(feedbackId);
  revalidatePath('/feedback');
}
