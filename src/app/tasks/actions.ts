'use server';

import { revalidatePath } from 'next/cache';
import { createTask, updateTask, deleteTask, TaskStatus } from '@/lib/task-store';

export async function createTaskAction(formData: FormData) {
  const type = formData.get('type')?.toString().trim() || 'Untitled Task';
  const agentId = formData.get('agentId')?.toString().trim() || 'Unknown';
  const status = (formData.get('status')?.toString().trim() || 'queued') as TaskStatus;
  const progress = Number(formData.get('progress') ?? 0);

  await createTask({ type, agentId, status, progress });
  revalidatePath('/tasks');
}

export async function updateTaskAction(formData: FormData) {
  const id = formData.get('taskId')?.toString();
  if (!id) return;

  const status = formData.get('status')?.toString() as TaskStatus | undefined;
  const progress = formData.get('progress');
  const type = formData.get('type')?.toString();
  const agentId = formData.get('agentId')?.toString();

  await updateTask(id, {
    status,
    type,
    agentId,
    progress: progress !== null ? Number(progress) : undefined,
  });

  revalidatePath('/tasks');
}

export async function deleteTaskAction(formData: FormData) {
  const id = formData.get('taskId')?.toString();
  if (!id) return;

  await deleteTask(id);
  revalidatePath('/tasks');
}
