// Mock data for OpenClaw Mission Control

export interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  tasks: number;
  cpu: number;
  memory: number;
  lastActive: string;
}

export interface Task {
  id: string;
  type: string;
  agentId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  title: string;
  requester: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface MemoryUsage {
  total: number;
  used: number;
  collections: number;
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  tasks: number;
  agents: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'meeting' | 'deadline' | 'reminder';
}

export interface Activity {
  id: string;
  agent: string;
  action: string;
  timestamp: string;
}

export const agents: Agent[] = [
  { id: '1', name: 'Kestrel', status: 'running', tasks: 3, cpu: 45, memory: 68, lastActive: '2 min ago' },
  { id: '2', name: 'Byte', status: 'idle', tasks: 0, cpu: 12, memory: 24, lastActive: '5 min ago' },
  { id: '3', name: 'Sentinel', status: 'running', tasks: 1, cpu: 28, memory: 42, lastActive: '1 min ago' },
  { id: '4', name: 'Hearth', status: 'paused', tasks: 0, cpu: 5, memory: 18, lastActive: '10 min ago' },
  { id: '5', name: 'Orion', status: 'error', tasks: 0, cpu: 90, memory: 95, lastActive: 'Just now' },
];

export const tasks: Task[] = [
  { id: '1', type: 'Code Review', agentId: '1', status: 'running', progress: 75, createdAt: '10:30 AM', updatedAt: '11:45 AM' },
  { id: '2', type: 'Data Processing', agentId: '3', status: 'queued', progress: 0, createdAt: '9:15 AM', updatedAt: '9:15 AM' },
  { id: '3', type: 'API Integration', agentId: '1', status: 'completed', progress: 100, createdAt: '8:00 AM', updatedAt: '10:00 AM' },
  { id: '4', type: 'System Backup', agentId: '2', status: 'failed', progress: 30, createdAt: '7:30 AM', updatedAt: '8:05 AM' },
  { id: '5', type: 'Model Training', agentId: '1', status: 'running', progress: 45, createdAt: '11:00 AM', updatedAt: '11:30 AM' },
];

export const approvals: Approval[] = [
  { id: '1', title: 'Deploy to Production', requester: 'Kestrel', status: 'pending', priority: 'high', createdAt: '10 min ago' },
  { id: '2', title: 'Add New API Key', requester: 'Byte', status: 'pending', priority: 'medium', createdAt: '25 min ago' },
  { id: '3', title: 'Restart Gateway Service', requester: 'Sentinel', status: 'pending', priority: 'low', createdAt: '1 hour ago' },
  { id: '4', title: 'Update Documentation', requester: 'Hearth', status: 'approved', priority: 'low', createdAt: '2 hours ago' },
];

export const memoryUsage: MemoryUsage = {
  total: 1024, // GB
  used: 687,
  collections: 24,
};

export const projects: Project[] = [
  { id: '1', name: 'Agent Orchestration', progress: 85, tasks: 42, agents: 4 },
  { id: '2', name: 'Memory Optimization', progress: 30, tasks: 18, agents: 2 },
  { id: '3', name: 'Multi‑Agent Routing', progress: 60, tasks: 25, agents: 3 },
  { id: '4', name: 'Dashboard UI', progress: 90, tasks: 12, agents: 1 },
];

export const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Sync', time: '11:30 AM', type: 'meeting' },
  { id: '2', title: 'Deadline: Q1 Report', time: '3:00 PM', type: 'deadline' },
  { id: '3', title: 'System Maintenance', time: '6:00 PM', type: 'reminder' },
];

export const activities: Activity[] = [
  { id: '1', agent: 'Kestrel', action: 'Started task #45', timestamp: '2 min ago' },
  { id: '2', agent: 'Sentinel', action: 'Alert: High CPU', timestamp: '5 min ago' },
  { id: '3', agent: 'Byte', action: 'Completed code review', timestamp: '12 min ago' },
  { id: '4', agent: 'Hearth', action: 'Paused due to inactivity', timestamp: '15 min ago' },
  { id: '5', agent: 'Kestrel', action: 'Sent message to Telegram', timestamp: '20 min ago' },
];

// System metrics
export const systemMetrics = {
  cpuUsage: 68,
  memoryUsage: 75,
  networkIn: 145,
  networkOut: 89,
  uptime: '12d 4h 32m',
};