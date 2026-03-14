'use server';

import { revalidatePath } from 'next/cache';
import { createSystemAlert, resolveAlert, restartService, setServiceStatus, AlertSeverity, ServiceStatus } from '@/lib/system-store';

export async function restartServiceAction(formData: FormData) {
  const serviceId = formData.get('serviceId')?.toString();
  if (!serviceId) return;

  restartService(serviceId);
  revalidatePath('/system');
}

export async function setServiceStatusAction(formData: FormData) {
  const serviceId = formData.get('serviceId')?.toString();
  const status = formData.get('status')?.toString() as ServiceStatus | undefined;
  if (!serviceId || !status) return;

  setServiceStatus(serviceId, status);
  revalidatePath('/system');
}

export async function resolveAlertAction(formData: FormData) {
  const alertId = formData.get('alertId')?.toString();
  if (!alertId) return;

  resolveAlert(alertId);
  revalidatePath('/system');
}

export async function createSystemAlertAction(formData: FormData) {
  const serviceId = formData.get('serviceId')?.toString();
  const severity = formData.get('severity')?.toString() as AlertSeverity | undefined;
  const message = formData.get('message')?.toString().trim();
  if (!serviceId || !severity || !message) return;

  createSystemAlert(serviceId, severity, message);
  revalidatePath('/system');
}
