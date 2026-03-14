'use server';

import { revalidatePath } from 'next/cache';
import { createEvent, updateEvent, deleteEvent, CalendarEventType } from '@/lib/calendar-store';

export async function createEventAction(formData: FormData) {
  const title = formData.get('title')?.toString().trim();
  const description = formData.get('description')?.toString().trim() || 'No description';
  const date = formData.get('date')?.toString();
  const time = formData.get('time')?.toString();
  const duration = Number(formData.get('duration') || 30);
  const type = formData.get('type')?.toString() as CalendarEventType;
  const relatedTaskId = formData.get('relatedTaskId')?.toString() || undefined;
  const relatedApprovalId = formData.get('relatedApprovalId')?.toString() || undefined;

  if (!title || !date || !time || !type) return;

  createEvent({
    title,
    description,
    date,
    time,
    duration,
    type,
    relatedTaskId,
    relatedApprovalId,
  });

  revalidatePath('/calendar');
}

export async function updateEventAction(formData: FormData) {
  const eventId = formData.get('eventId')?.toString();
  if (!eventId) return;

  const updates = {
    title: formData.get('title')?.toString() || undefined,
    date: formData.get('date')?.toString() || undefined,
    time: formData.get('time')?.toString() || undefined,
    duration: formData.get('duration') ? Number(formData.get('duration')) : undefined,
    type: formData.get('type')?.toString() as CalendarEventType | undefined,
    description: formData.get('description')?.toString() || undefined,
    relatedTaskId: formData.get('relatedTaskId')?.toString() || undefined,
    relatedApprovalId: formData.get('relatedApprovalId')?.toString() || undefined,
  };

  updateEvent(eventId, updates);
  revalidatePath('/calendar');
}

export async function deleteEventAction(formData: FormData) {
  const eventId = formData.get('eventId')?.toString();
  if (!eventId) return;

  deleteEvent(eventId);
  revalidatePath('/calendar');
}
