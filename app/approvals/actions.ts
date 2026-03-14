'use server';

import { revalidatePath } from 'next/cache';
import { approveRequest, rejectRequest, editRequest } from '@/lib/approval-store';

export async function approveRequestAction(formData: FormData) {
  const approvalId = formData.get('approvalId')?.toString();
  if (!approvalId) return;

  const comment = formData.get('comment')?.toString();
  approveRequest(approvalId, comment);

  revalidatePath('/approvals');
}

export async function rejectRequestAction(formData: FormData) {
  const approvalId = formData.get('approvalId')?.toString();
  const comment = formData.get('comment')?.toString();
  if (!approvalId || !comment) return;

  rejectRequest(approvalId, comment);
  revalidatePath('/approvals');
}

export async function editRequestAction(formData: FormData) {
  const approvalId = formData.get('approvalId')?.toString();
  const title = formData.get('title')?.toString();
  const priority = formData.get('priority')?.toString();
  const requester = formData.get('requester')?.toString();
  const comment = formData.get('comment')?.toString();

  if (!approvalId || !title || !priority || !comment) return;

  editRequest(
    approvalId,
    {
      title,
      priority: priority as any,
      requester: requester || 'Unknown',
    },
    comment,
  );

  revalidatePath('/approvals');
}
