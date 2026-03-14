'use server';

import { revalidatePath } from 'next/cache';
import { cancelOfficeBooking, createOfficeBooking, RoomStatus, updateRoomStatus } from '@/lib/office-store';

export async function createOfficeBookingAction(formData: FormData) {
  const roomId = formData.get('roomId')?.toString();
  const owner = formData.get('owner')?.toString().trim();
  const purpose = formData.get('purpose')?.toString().trim() || 'Session';
  const startAt = formData.get('startAt')?.toString();
  const endAt = formData.get('endAt')?.toString();
  if (!roomId || !owner || !startAt || !endAt) return;

  createOfficeBooking({ roomId, owner, purpose, startAt, endAt });
  revalidatePath('/office');
}

export async function updateRoomStatusAction(formData: FormData) {
  const roomId = formData.get('roomId')?.toString();
  const status = formData.get('status')?.toString() as RoomStatus | undefined;
  if (!roomId || !status) return;

  updateRoomStatus(roomId, status);
  revalidatePath('/office');
}

export async function cancelOfficeBookingAction(formData: FormData) {
  const bookingId = formData.get('bookingId')?.toString();
  if (!bookingId) return;

  cancelOfficeBooking(bookingId);
  revalidatePath('/office');
}
