import { memoryUsage as baseUsage } from '@/lib/data';

export interface MemoryCollection {
  id: string;
  name: string;
  description: string;
  model: string;
  vectors: number;
  lastUpdated: string;
  tags: string[];
}

export interface MemoryFragment {
  id: string;
  collectionId: string;
  topic: string;
  content: string;
  relevance: number;
  timestamp: string;
}

export interface MemorySearchEntry {
  id: string;
  query: string;
  timestamp: string;
}

export interface MemoryState {
  usage: typeof baseUsage;
  collections: MemoryCollection[];
  fragments: MemoryFragment[];
  history: MemorySearchEntry[];
}

const initialCollections: MemoryCollection[] = [
  {
    id: 'col-ops',
    name: 'Operations',
    description: 'Procedimientos y playbooks para incidentes',
    model: 'text-embedding-004',
    vectors: 18240,
    lastUpdated: 'Hace 10 min',
    tags: ['ops', 'runbooks'],
  },
  {
    id: 'col-clients',
    name: 'Clients',
    description: 'Contexto crítico de clientes y leads',
    model: 'text-embedding-004',
    vectors: 9640,
    lastUpdated: 'Hace 22 min',
    tags: ['sales', 'support'],
  },
  {
    id: 'col-product',
    name: 'Product',
    description: 'Notas de producto, specs y aprendizajes',
    model: 'text-embedding-004',
    vectors: 21430,
    lastUpdated: 'Hace 45 min',
    tags: ['product', 'research'],
  },
];

const initialFragments: MemoryFragment[] = [
  {
    id: 'mem-1',
    collectionId: 'col-ops',
    topic: 'Gateway restart SOP',
    content: 'Para reiniciar Gateway: validar healthcheck, ejecutar openclaw gateway restart, monitorear logs 5 min.',
    relevance: 0.92,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'mem-2',
    collectionId: 'col-clients',
    topic: 'Cliente Orpheus',
    content: 'Prioridad alta, requiere actualizaciones cada 4h y canales seguros (Signal + Portal).',
    relevance: 0.88,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'mem-3',
    collectionId: 'col-product',
    topic: 'LLM Guardrails',
    content: 'Nuevo módulo de filtros contextuales reduce hallazgos falsos positivos en 32%.',
    relevance: 0.81,
    timestamp: new Date().toISOString(),
  },
];

let memoryState: MemoryState = {
  usage: { ...baseUsage },
  collections: initialCollections,
  fragments: initialFragments,
  history: [],
};

export function getMemoryState(): MemoryState {
  return {
    ...memoryState,
    collections: memoryState.collections.slice(),
    fragments: memoryState.fragments.slice(),
    history: memoryState.history.slice(0, 10),
  };
}

export function createCollection(data: { name: string; description: string; tags: string[]; model?: string }) {
  const newCollection: MemoryCollection = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    model: data.model || 'text-embedding-004',
    tags: data.tags,
    vectors: 0,
    lastUpdated: 'Just now',
  };

  memoryState = {
    ...memoryState,
    collections: [newCollection, ...memoryState.collections],
    usage: {
      ...memoryState.usage,
      collections: memoryState.usage.collections + 1,
    },
  };
}

export function deleteCollection(collectionId: string) {
  memoryState = {
    ...memoryState,
    collections: memoryState.collections.filter((collection) => collection.id !== collectionId),
    fragments: memoryState.fragments.filter((fragment) => fragment.collectionId !== collectionId),
    usage: {
      ...memoryState.usage,
      collections: Math.max(0, memoryState.usage.collections - 1),
    },
  };
}

export function injectContext(collectionId: string, content: string, topic: string) {
  const fragment: MemoryFragment = {
    id: crypto.randomUUID(),
    collectionId,
    topic,
    content,
    relevance: 0.75 + Math.random() * 0.2,
    timestamp: new Date().toISOString(),
  };

  memoryState = {
    ...memoryState,
    fragments: [fragment, ...memoryState.fragments].slice(0, 50),
    usage: {
      ...memoryState.usage,
      used: Math.min(memoryState.usage.total, memoryState.usage.used + Math.ceil(content.length / 500)),
    },
  };
}

export function searchMemories(query: string): MemoryFragment[] {
  if (!query) return [];
  const normalized = query.toLowerCase();
  return memoryState.fragments.filter(
    (fragment) =>
      fragment.topic.toLowerCase().includes(normalized) || fragment.content.toLowerCase().includes(normalized),
  );
}

export function recordSearch(query: string) {
  if (!query) return;
  const entry: MemorySearchEntry = {
    id: crypto.randomUUID(),
    query,
    timestamp: new Date().toISOString(),
  };

  memoryState = {
    ...memoryState,
    history: [entry, ...memoryState.history].slice(0, 10),
  };
}
