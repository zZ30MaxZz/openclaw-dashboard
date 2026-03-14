export type TeamPresence = 'online' | 'focus' | 'offline' | 'on-call';

export interface TeamMemberRecord {
  id: string;
  name: string;
  role: string;
  squad: string;
  timezone: string;
  presence: TeamPresence;
  currentLoad: number;
  capacity: number;
  skills: string[];
  lastCheckIn: string;
}

let teamStore: TeamMemberRecord[] = [
  {
    id: 'tm-1',
    name: 'Nadia Ruiz',
    role: 'Ops Lead',
    squad: 'Mission Ops',
    timezone: 'America/Lima',
    presence: 'on-call',
    currentLoad: 72,
    capacity: 85,
    skills: ['incident', 'routing', 'security'],
    lastCheckIn: new Date().toISOString(),
  },
  {
    id: 'tm-2',
    name: 'Luis Vega',
    role: 'Platform Engineer',
    squad: 'Runtime',
    timezone: 'America/Mexico_City',
    presence: 'online',
    currentLoad: 60,
    capacity: 90,
    skills: ['infra', 'api', 'queues'],
    lastCheckIn: new Date().toISOString(),
  },
  {
    id: 'tm-3',
    name: 'Rina Park',
    role: 'UX Writer',
    squad: 'Experience',
    timezone: 'America/New_York',
    presence: 'focus',
    currentLoad: 45,
    capacity: 80,
    skills: ['docs', 'copy', 'onboarding'],
    lastCheckIn: new Date().toISOString(),
  },
];

export function getTeamMembers(): TeamMemberRecord[] {
  return teamStore.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function createTeamMember(input: {
  name: string;
  role: string;
  squad: string;
  timezone: string;
  capacity?: number;
  skills?: string[];
}) {
  const member: TeamMemberRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    role: input.role,
    squad: input.squad,
    timezone: input.timezone,
    presence: 'online',
    currentLoad: 0,
    capacity: clamp(input.capacity ?? 80),
    skills: input.skills ?? [],
    lastCheckIn: new Date().toISOString(),
  };

  teamStore = [member, ...teamStore];
  return member;
}

export function updateTeamMember(
  id: string,
  updates: Partial<Pick<TeamMemberRecord, 'presence' | 'currentLoad' | 'capacity' | 'role' | 'squad' | 'timezone'>>,
) {
  const index = teamStore.findIndex((member) => member.id === id);
  if (index === -1) throw new Error(`Team member ${id} not found`);

  const updated: TeamMemberRecord = {
    ...teamStore[index],
    ...updates,
    currentLoad: updates.currentLoad !== undefined ? clamp(updates.currentLoad) : teamStore[index].currentLoad,
    capacity: updates.capacity !== undefined ? clamp(updates.capacity) : teamStore[index].capacity,
    lastCheckIn: new Date().toISOString(),
  };

  teamStore = [...teamStore.slice(0, index), updated, ...teamStore.slice(index + 1)];
  return updated;
}

export function removeTeamMember(id: string) {
  teamStore = teamStore.filter((member) => member.id !== id);
}

function clamp(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
