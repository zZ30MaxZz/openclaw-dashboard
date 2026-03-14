import { calendarEvents } from '@/lib/data';

export type CalendarEventType = 'meeting' | 'deadline' | 'reminder';

export interface CalendarEventRecord {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  type: CalendarEventType;
  relatedTaskId?: string;
  relatedApprovalId?: string;
  location?: string;
}

let eventStore: CalendarEventRecord[] = calendarEvents.map((event, index) => ({
  id: event.id,
  title: event.title,
  description: `${event.title} (${event.type})`,
  date: formatDate(addDays(new Date(), index)),
  time: to24h(event.time),
  duration: event.type === 'meeting' ? 60 : 30,
  type: event.type,
}));

export function getEvents(): CalendarEventRecord[] {
  return eventStore
    .slice()
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

export function createEvent(data: Omit<CalendarEventRecord, 'id'>) {
  const newEvent: CalendarEventRecord = {
    ...data,
    id: crypto.randomUUID(),
  };
  eventStore = [...eventStore, newEvent];
}

export function updateEvent(id: string, updates: Partial<CalendarEventRecord>) {
  const index = eventStore.findIndex((event) => event.id === id);
  if (index === -1) throw new Error(`Event ${id} not found`);
  eventStore = [
    ...eventStore.slice(0, index),
    { ...eventStore[index], ...updates },
    ...eventStore.slice(index + 1),
  ];
}

export function deleteEvent(id: string) {
  eventStore = eventStore.filter((event) => event.id !== id);
}

export function getEventsInRange(startDate: Date, endDate: Date) {
  return getEvents().filter((event) => {
    const date = new Date(event.date);
    return date >= startDate && date <= endDate;
  });
}

function to24h(time: string): string {
  const match = time.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
  if (!match) return time;
  let [_, hours, minutes, meridiem] = match;
  let hrs = parseInt(hours, 10);
  if (meridiem?.toLowerCase() === 'pm' && hrs < 12) hrs += 12;
  if (meridiem?.toLowerCase() === 'am' && hrs === 12) hrs = 0;
  return `${hrs.toString().padStart(2, '0')}:${minutes}`;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}
