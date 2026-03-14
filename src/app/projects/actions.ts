'use server';

import { revalidatePath } from 'next/cache';
import {
  createProject,
  updateProject,
  deleteProject,
  assignTaskToProject,
  assignAgentToProject,
  ProjectStatus,
} from '@/lib/project-store';

export async function createProjectAction(formData: FormData) {
  const name = formData.get('name')?.toString().trim();
  const owner = formData.get('owner')?.toString().trim() || 'Mission Control';
  const description = formData.get('description')?.toString().trim() || 'Sin descripción';
  const status = (formData.get('status')?.toString() ?? 'on-track') as ProjectStatus;
  const deadline = formData.get('deadline')?.toString() || new Date().toISOString().split('T')[0];
  const progress = Number(formData.get('progress') ?? 0);
  const tasks = Number(formData.get('tasks') ?? 0);
  const agents = Number(formData.get('agents') ?? 0);

  if (!name) return;

  createProject({ name, owner, description, status, deadline, progress, tasks, agents });
  revalidatePath('/projects');
}

export async function updateProjectAction(formData: FormData) {
  const projectId = formData.get('projectId')?.toString();
  if (!projectId) return;

  const updates = {
    name: formData.get('name')?.toString() || undefined,
    owner: formData.get('owner')?.toString() || undefined,
    description: formData.get('description')?.toString() || undefined,
    status: formData.get('status')?.toString() as ProjectStatus | undefined,
    deadline: formData.get('deadline')?.toString() || undefined,
    progress: formData.get('progress') ? Number(formData.get('progress')) : undefined,
  };

  updateProject(projectId, updates);
  revalidatePath('/projects');
}

export async function deleteProjectAction(formData: FormData) {
  const projectId = formData.get('projectId')?.toString();
  if (!projectId) return;

  deleteProject(projectId);
  revalidatePath('/projects');
}

export async function assignTaskToProjectAction(formData: FormData) {
  const projectId = formData.get('projectId')?.toString();
  const taskId = formData.get('taskId')?.toString();
  if (!projectId || !taskId) return;

  assignTaskToProject(projectId, taskId);
  revalidatePath('/projects');
}

export async function assignAgentToProjectAction(formData: FormData) {
  const projectId = formData.get('projectId')?.toString();
  const agentName = formData.get('agentName')?.toString();
  if (!projectId || !agentName) return;

  assignAgentToProject(projectId, agentName);
  revalidatePath('/projects');
}
