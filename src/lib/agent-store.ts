import { agents as seedAgents, Agent } from '@/lib/data';

let agentStore: Agent[] = seedAgents.map((agent) => ({
  ...agent,
  lastActive: normalizeTimestamp(agent.lastActive),
}));

function normalizeTimestamp(value: string) {
  // If it's already a relative time string, keep it
  if (value.includes('ago') || value.includes('min') || value.includes('hour') || value === 'Just now') {
    return value;
  }
  
  // Try to parse as date
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    const date = new Date(parsed);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 120) return '1 hour ago';
    return `${Math.floor(diffMins / 60)} hours ago`;
  }
  
  return value;
}

export function getAgents(): Agent[] {
  return agentStore.slice();
}

export function getAgent(id: string): Agent | undefined {
  return agentStore.find(agent => agent.id === id);
}

export function updateAgentStatus(id: string, status: Agent['status']): Agent {
  const index = agentStore.findIndex(agent => agent.id === id);
  if (index === -1) {
    throw new Error(`Agent with id ${id} not found`);
  }

  const updated: Agent = {
    ...agentStore[index],
    status,
    lastActive: 'Just now',
  };

  agentStore = [
    ...agentStore.slice(0, index),
    updated,
    ...agentStore.slice(index + 1),
  ];

  return updated;
}

export function updateAgentMetrics(id: string, metrics: Partial<Pick<Agent, 'cpu' | 'memory' | 'tasks'>>): Agent {
  const index = agentStore.findIndex(agent => agent.id === id);
  if (index === -1) {
    throw new Error(`Agent with id ${id} not found`);
  }

  const updated: Agent = {
    ...agentStore[index],
    ...metrics,
    lastActive: 'Just now',
  };

  agentStore = [
    ...agentStore.slice(0, index),
    updated,
    ...agentStore.slice(index + 1),
  ];

  return updated;
}

export function assignTaskToAgent(agentId: string): Agent {
  const agent = getAgent(agentId);
  if (!agent) {
    throw new Error(`Agent with id ${agentId} not found`);
  }

  return updateAgentMetrics(agentId, {
    tasks: agent.tasks + 1,
  });
}