export type FeedbackStatus = 'new' | 'triaged' | 'planned' | 'resolved';
export type FeedbackCategory = 'bug' | 'feature' | 'ux' | 'performance' | 'support';
export type FeedbackSentiment = 'negative' | 'neutral' | 'positive';
export type FeedbackPriority = 'low' | 'medium' | 'high';

export interface FeedbackRecord {
  id: string;
  title: string;
  description: string;
  reporter: string;
  category: FeedbackCategory;
  sentiment: FeedbackSentiment;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  assignedTo?: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

let feedbackStore: FeedbackRecord[] = [
  {
    id: 'fb-1',
    title: 'Task board takes too many clicks',
    description: 'Need bulk actions for status transitions.',
    reporter: 'Alicia',
    category: 'ux',
    sentiment: 'negative',
    priority: 'high',
    status: 'triaged',
    assignedTo: 'Rina',
    votes: 21,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fb-2',
    title: 'Expose API usage in dashboard',
    description: 'Include token and request usage by agent.',
    reporter: 'Marcos',
    category: 'feature',
    sentiment: 'positive',
    priority: 'medium',
    status: 'planned',
    assignedTo: 'Luis',
    votes: 14,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fb-3',
    title: 'Webhook retries are noisy',
    description: 'Need smarter retry backoff for transient errors.',
    reporter: 'Nadia',
    category: 'performance',
    sentiment: 'neutral',
    priority: 'medium',
    status: 'new',
    votes: 8,
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getFeedbackItems(): FeedbackRecord[] {
  return feedbackStore
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function createFeedback(input: {
  title: string;
  description: string;
  reporter: string;
  category: FeedbackCategory;
  sentiment: FeedbackSentiment;
  priority: FeedbackPriority;
}) {
  const now = new Date().toISOString();
  const item: FeedbackRecord = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    reporter: input.reporter,
    category: input.category,
    sentiment: input.sentiment,
    priority: input.priority,
    status: 'new',
    votes: 1,
    createdAt: now,
    updatedAt: now,
  };

  feedbackStore = [item, ...feedbackStore];
  return item;
}

export function updateFeedback(
  id: string,
  updates: Partial<Pick<FeedbackRecord, 'status' | 'priority' | 'assignedTo' | 'category' | 'sentiment'>>,
) {
  const index = feedbackStore.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`Feedback ${id} not found`);

  const updated: FeedbackRecord = {
    ...feedbackStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  feedbackStore = [...feedbackStore.slice(0, index), updated, ...feedbackStore.slice(index + 1)];
}

export function deleteFeedback(id: string) {
  feedbackStore = feedbackStore.filter((item) => item.id !== id);
}

export function voteFeedback(id: string) {
  const index = feedbackStore.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`Feedback ${id} not found`);

  feedbackStore = [
    ...feedbackStore.slice(0, index),
    { ...feedbackStore[index], votes: feedbackStore[index].votes + 1, updatedAt: new Date().toISOString() },
    ...feedbackStore.slice(index + 1),
  ];
}
