// Mock data for documentation
export interface Document {
  id: string;
  title: string;
  description: string;
  category: 'guide' | 'api' | 'tutorial' | 'reference' | 'faq';
  tags: string[];
  content: string;
  lastUpdated: string;
  author: string;
}

const initialDocs: Document[] = [
  {
    id: '1',
    title: 'Getting Started with OpenClaw',
    description: 'Complete guide to setting up and using OpenClaw AI orchestration',
    category: 'guide',
    tags: ['beginner', 'setup', 'configuration'],
    content: '# Getting Started\n\nOpenClaw is an AI agent orchestration platform...',
    lastUpdated: '2026-03-12',
    author: 'Kestrel',
  },
  {
    id: '2',
    title: 'Agent API Reference',
    description: 'Complete API documentation for agent management',
    category: 'api',
    tags: ['api', 'reference', 'technical'],
    content: '# Agent API\n\nAll endpoints for managing AI agents...',
    lastUpdated: '2026-03-11',
    author: 'Byte',
  },
  {
    id: '3',
    title: 'Multi-Agent Workflows',
    description: 'Creating complex workflows with multiple agents',
    category: 'tutorial',
    tags: ['workflows', 'advanced', 'orchestration'],
    content: '# Multi-Agent Workflows\n\nLearn how to coordinate multiple agents...',
    lastUpdated: '2026-03-10',
    author: 'Sentinel',
  },
  {
    id: '4',
    title: 'Troubleshooting Common Issues',
    description: 'Solutions for frequently encountered problems',
    category: 'faq',
    tags: ['troubleshooting', 'help', 'support'],
    content: '# Troubleshooting\n\nCommon issues and their solutions...',
    lastUpdated: '2026-03-09',
    author: 'Hearth',
  },
  {
    id: '5',
    title: 'Memory System Architecture',
    description: 'Deep dive into the vector store and memory system',
    category: 'reference',
    tags: ['architecture', 'memory', 'technical'],
    content: '# Memory System\n\nHow OpenClaw manages agent memory...',
    lastUpdated: '2026-03-08',
    author: 'Gitflow',
  },
];

let docsStore: Document[] = [...initialDocs];

export function getDocuments(): Document[] {
  return docsStore.slice();
}

export function getDocument(id: string): Document | undefined {
  return docsStore.find(doc => doc.id === id);
}

export function searchDocuments(query: string): Document[] {
  const q = query.toLowerCase();
  return docsStore.filter(doc =>
    doc.title.toLowerCase().includes(q) ||
    doc.description.toLowerCase().includes(q) ||
    doc.tags.some(tag => tag.toLowerCase().includes(q)) ||
    doc.content.toLowerCase().includes(q)
  );
}

export function createDocument(input: Omit<Document, 'id' | 'lastUpdated'>): Document {
  const now = new Date().toISOString().split('T')[0];
  const doc: Document = {
    id: crypto.randomUUID(),
    ...input,
    lastUpdated: now,
  };

  docsStore = [doc, ...docsStore];
  return doc;
}

export function updateDocument(id: string, updates: Partial<Omit<Document, 'id'>>): Document {
  const index = docsStore.findIndex(doc => doc.id === id);
  if (index === -1) {
    throw new Error(`Document with id ${id} not found`);
  }

  const updated: Document = {
    ...docsStore[index],
    ...updates,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  docsStore = [
    ...docsStore.slice(0, index),
    updated,
    ...docsStore.slice(index + 1),
  ];

  return updated;
}

export function deleteDocument(id: string): void {
  docsStore = docsStore.filter(doc => doc.id !== id);
}

export function getDocumentCounts() {
  const categories = ['guide', 'api', 'tutorial', 'reference', 'faq'] as const;
  return categories.map(category => ({
    category,
    count: docsStore.filter(doc => doc.category === category).length,
  }));
}