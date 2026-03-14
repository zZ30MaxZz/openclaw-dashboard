import { projects as seedProjects, Project } from '@/lib/data';

export type ProjectStatus = 'on-track' | 'at-risk' | 'blocked';

export interface ProjectRecord extends Project {
  status: ProjectStatus;
  owner: string;
  description: string;
  deadline: string; // ISO date
  linkedTasks: string[];
  linkedAgents: string[];
}

const defaultOwners = ['Kestrel', 'Byte', 'Sentinel', 'Hearth', 'Orion'];

let projectStore: ProjectRecord[] = seedProjects.map((project, index) => ({
  ...project,
  status: project.progress >= 70 ? 'on-track' : project.progress >= 40 ? 'at-risk' : 'blocked',
  owner: defaultOwners[index % defaultOwners.length],
  description: `${project.name} — seguimiento estratégico y entrega de hitos`,
  deadline: addDaysISO(new Date(), (index + 1) * 7),
  linkedTasks: [],
  linkedAgents: [],
}));

export function getProjects(): ProjectRecord[] {
  return projectStore.slice().sort((a, b) => b.progress - a.progress);
}

export function createProject(input: {
  name: string;
  description: string;
  owner: string;
  status: ProjectStatus;
  deadline: string;
  progress?: number;
  tasks?: number;
  agents?: number;
}): ProjectRecord {
  const record: ProjectRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    owner: input.owner,
    status: input.status,
    deadline: input.deadline,
    progress: clamp(input.progress ?? 0, 0, 100),
    tasks: input.tasks ?? 0,
    agents: input.agents ?? 0,
    linkedTasks: [],
    linkedAgents: [],
  };

  projectStore = [record, ...projectStore];
  return record;
}

export function updateProject(projectId: string, updates: Partial<ProjectRecord>) {
  const index = projectStore.findIndex((project) => project.id === projectId);
  if (index === -1) throw new Error(`Project ${projectId} not found`);

  projectStore = [
    ...projectStore.slice(0, index),
    {
      ...projectStore[index],
      ...updates,
      progress: updates.progress !== undefined ? clamp(updates.progress, 0, 100) : projectStore[index].progress,
    },
    ...projectStore.slice(index + 1),
  ];
}

export function deleteProject(projectId: string) {
  projectStore = projectStore.filter((project) => project.id !== projectId);
}

export function assignTaskToProject(projectId: string, taskId: string) {
  mutateProject(projectId, (project) => {
    if (project.linkedTasks.includes(taskId)) return project;
    return {
      ...project,
      linkedTasks: [taskId, ...project.linkedTasks],
      tasks: project.tasks + 1,
    };
  });
}

export function assignAgentToProject(projectId: string, agentName: string) {
  mutateProject(projectId, (project) => {
    if (project.linkedAgents.includes(agentName)) return project;
    return {
      ...project,
      linkedAgents: [agentName, ...project.linkedAgents],
      agents: project.agents + 1,
    };
  });
}

function mutateProject(projectId: string, updater: (project: ProjectRecord) => ProjectRecord) {
  const index = projectStore.findIndex((project) => project.id === projectId);
  if (index === -1) throw new Error(`Project ${projectId} not found`);
  projectStore = [
    ...projectStore.slice(0, index),
    updater(projectStore[index]),
    ...projectStore.slice(index + 1),
  ];
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function addDaysISO(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate.toISOString().split('T')[0];
}
