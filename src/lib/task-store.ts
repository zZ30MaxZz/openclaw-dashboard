import { tasks as seedTasks, Task } from '@/lib/data';

export type TaskStatus = Task['status'];

let taskStore: Task[] = seedTasks.map((task) => ({
  ...task,
  createdAt: normalizeTimestamp(task.createdAt),
  updatedAt: normalizeTimestamp(task.updatedAt),
}));

function normalizeTimestamp(value: string) {
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString();
  }

  const today = new Date();
  const [time, meridiem] = value.split(' ');
  if (!time) return today.toISOString();

  const [hoursStr, minutesStr] = time.split(':');
  if (!hoursStr || !minutesStr) return today.toISOString();

  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (meridiem?.toLowerCase() === 'pm' && hours < 12) hours += 12;
  if (meridiem?.toLowerCase() === 'am' && hours === 12) hours = 0;

  const normalized = new Date(today);
  normalized.setHours(hours, minutes, 0, 0);
  return normalized.toISOString();
}

export function getTasks(): Task[] {
  return taskStore
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function createTask(input: {
  type: string;
  agentId: string;
  status?: TaskStatus;
  progress?: number;
}): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: crypto.randomUUID(),
    type: input.type || 'Untitled Task',
    agentId: input.agentId || 'N/A',
    status: input.status ?? 'queued',
    progress: clampProgress(input.progress ?? 0),
    createdAt: now,
    updatedAt: now,
  };

  taskStore = [task, ...taskStore];
  return task;
}

export function updateTask(id: string, updates: Partial<Pick<Task, 'status' | 'progress' | 'type' | 'agentId'>>): Task {
  const index = taskStore.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new Error(`Task with id ${id} not found`);
  }

  const updated: Task = {
    ...taskStore[index],
    ...updates,
    progress: updates.progress !== undefined ? clampProgress(updates.progress) : taskStore[index].progress,
    updatedAt: new Date().toISOString(),
  };

  taskStore = [
    ...taskStore.slice(0, index),
    updated,
    ...taskStore.slice(index + 1),
  ];

  return updated;
}

export function deleteTask(id: string): void {
  taskStore = taskStore.filter((task) => task.id !== id);
}

function clampProgress(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}
