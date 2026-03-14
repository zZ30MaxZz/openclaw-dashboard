'use server';

import { revalidatePath } from 'next/cache';
import { createTeamMember, removeTeamMember, TeamPresence, updateTeamMember } from '@/lib/team-store';

export async function createTeamMemberAction(formData: FormData) {
  const name = formData.get('name')?.toString().trim();
  const role = formData.get('role')?.toString().trim();
  const squad = formData.get('squad')?.toString().trim() || 'General';
  const timezone = formData.get('timezone')?.toString().trim() || 'UTC';
  const capacity = Number(formData.get('capacity') ?? 80);
  const skillsRaw = formData.get('skills')?.toString() || '';
  if (!name || !role) return;

  const skills = skillsRaw
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

  createTeamMember({ name, role, squad, timezone, capacity, skills });
  revalidatePath('/team');
}

export async function updateTeamMemberAction(formData: FormData) {
  const memberId = formData.get('memberId')?.toString();
  if (!memberId) return;

  const updates = {
    presence: formData.get('presence')?.toString() as TeamPresence | undefined,
    currentLoad: formData.get('currentLoad') ? Number(formData.get('currentLoad')) : undefined,
    capacity: formData.get('capacity') ? Number(formData.get('capacity')) : undefined,
  };

  updateTeamMember(memberId, updates);
  revalidatePath('/team');
}

export async function deleteTeamMemberAction(formData: FormData) {
  const memberId = formData.get('memberId')?.toString();
  if (!memberId) return;

  removeTeamMember(memberId);
  revalidatePath('/team');
}
