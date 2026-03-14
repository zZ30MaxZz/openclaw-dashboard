export type ContentStatus = 'draft' | 'in-review' | 'scheduled' | 'published';
export type ContentPriority = 'low' | 'medium' | 'high';
export type ContentChannel = 'blog' | 'docs' | 'social' | 'email';

export interface ContentRecord {
  id: string;
  title: string;
  brief: string;
  owner: string;
  channel: ContentChannel;
  status: ContentStatus;
  priority: ContentPriority;
  dueDate: string;
  artifactUrl?: string;
  createdAt: string;
  updatedAt: string;
}

let contentStore: ContentRecord[] = [
  {
    id: 'cnt-1',
    title: 'Q2 Feature Spotlight',
    brief: 'Resumen de mejoras del runtime y guardrails.',
    owner: 'Nadia',
    channel: 'blog',
    status: 'in-review',
    priority: 'high',
    dueDate: isoDate(2),
    artifactUrl: 'https://github.com/openclaw/dashboard/pull/42',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cnt-2',
    title: 'Onboarding Checklist',
    brief: 'Checklist corto para nuevos operadores.',
    owner: 'Luis',
    channel: 'docs',
    status: 'scheduled',
    priority: 'medium',
    dueDate: isoDate(4),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cnt-3',
    title: 'Incident Postmortem Thread',
    brief: 'Hilo con aprendizajes y próximas acciones.',
    owner: 'Rina',
    channel: 'social',
    status: 'draft',
    priority: 'high',
    dueDate: isoDate(1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cnt-4',
    title: 'Weekly Customer Digest',
    brief: 'Resumen semanal de progreso para clientes.',
    owner: 'Kai',
    channel: 'email',
    status: 'published',
    priority: 'low',
    dueDate: isoDate(-1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getContentItems(): ContentRecord[] {
  return contentStore
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function createContentItem(input: {
  title: string;
  brief: string;
  owner: string;
  channel: ContentChannel;
  priority: ContentPriority;
  dueDate: string;
}) {
  const now = new Date().toISOString();
  const item: ContentRecord = {
    id: crypto.randomUUID(),
    title: input.title,
    brief: input.brief,
    owner: input.owner,
    channel: input.channel,
    status: 'draft',
    priority: input.priority,
    dueDate: input.dueDate,
    createdAt: now,
    updatedAt: now,
  };

  contentStore = [item, ...contentStore];
  return item;
}

export function updateContentItem(
  id: string,
  updates: Partial<Pick<ContentRecord, 'title' | 'brief' | 'owner' | 'channel' | 'status' | 'priority' | 'dueDate' | 'artifactUrl'>>,
) {
  const index = contentStore.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`Content item ${id} not found`);

  const updated: ContentRecord = {
    ...contentStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  contentStore = [...contentStore.slice(0, index), updated, ...contentStore.slice(index + 1)];
  return updated;
}

export function deleteContentItem(id: string) {
  contentStore = contentStore.filter((item) => item.id !== id);
}

function isoDate(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
}
