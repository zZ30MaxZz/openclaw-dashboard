import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEvents, CalendarEventRecord, CalendarEventType } from '@/lib/calendar-store';
import { getTasks } from '@/lib/task-store';
import { getApprovals } from '@/lib/approval-store';
import { createEventAction, updateEventAction, deleteEventAction } from './actions';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  Timer,
} from 'lucide-react';

interface PageProps {
  searchParams?: Promise<{
    week?: string;
  }>;
}

export default async function CalendarPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const events = getEvents();
  const tasks = getTasks();
  const approvals = getApprovals();

  const weekOffset = Number(resolvedSearchParams?.week ?? 0);
  const today = new Date();
  const weekStart = startOfWeek(addDays(today, weekOffset * 7));
  const weekDays = Array.from({ length: 7 }, (_, idx) => addDays(weekStart, idx));
  const formattedWeekLabel = `${formatLongDate(weekDays[0])} - ${formatLongDate(weekDays[6])}`;

  const eventsByDay = weekDays.map((date) => {
    const iso = toISODate(date);
    return events.filter((event) => event.date === iso).sort((a, b) => a.time.localeCompare(b.time));
  });

  const typeCounts = {
    meeting: events.filter((event) => event.type === 'meeting').length,
    deadline: events.filter((event) => event.type === 'deadline').length,
    reminder: events.filter((event) => event.type === 'reminder').length,
  };

  const upcoming = events.filter((event) => new Date(event.date) >= startOfDay(today)).slice(0, 6);

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Calendar</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Temporal Orchestration</h1>
          <p className="text-muted-foreground max-w-3xl">
            Programa reuniones, deadlines y recordatorios sincronizados con tareas y aprobaciones.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <MetricPill label="Meetings" value={typeCounts.meeting} color="text-cyan-300" />
          <MetricPill label="Deadlines" value={typeCounts.deadline} color="text-red-300" />
          <MetricPill label="Reminders" value={typeCounts.reminder} color="text-yellow-300" />
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Semana: {formattedWeekLabel}
          </h2>
          <div className="flex items-center gap-2">
            <Link
              href={`/calendar?week=${weekOffset - 1}`}
              className="p-2 rounded-lg border border-border/60 hover:border-primary/40"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/calendar"
              className="px-3 py-2 rounded-lg border border-border/60 text-sm"
            >
              Hoy
            </Link>
            <Link
              href={`/calendar?week=${weekOffset + 1}`}
              className="p-2 rounded-lg border border-border/60 hover:border-primary/40"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
          {weekDays.map((date, idx) => (
            <Card key={date.toISOString()} className="glass-panel border border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{formatDayName(date)}</span>
                  <span className="text-sm text-muted-foreground">{date.getDate()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {eventsByDay[idx].length === 0 && (
                  <p className="text-xs text-muted-foreground">Sin eventos.</p>
                )}
                {eventsByDay[idx].map((event) => (
                  <div key={event.id} className="rounded-lg border border-border/40 p-3 bg-background/40">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{event.title}</p>
                      <EventTypeBadge type={event.type} />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {event.time} • {event.duration}m
                    </p>
                    {event.relatedTaskId && (
                      <p className="text-[11px] text-primary mt-1">Vinculado a Task #{event.relatedTaskId.slice(0, 6)}</p>
                    )}
                    {event.relatedApprovalId && (
                      <p className="text-[11px] text-accent">Approval #{event.relatedApprovalId.slice(0, 6)}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-accent" />
              Crear evento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <form action={createEventAction} className="space-y-3">
              <input type="text" name="title" placeholder="Título" className="w-full rounded-lg bg-background/60 border border-border/60 p-3" required />
              <textarea name="description" placeholder="Descripción" className="w-full rounded-lg bg-background/60 border border-border/60 p-3" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" name="date" className="rounded-lg bg-background/60 border border-border/60 p-3" defaultValue={toISODate(today)} required />
                <input type="time" name="time" className="rounded-lg bg-background/60 border border-border/60 p-3" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" name="duration" min={15} step={15} defaultValue={60} className="rounded-lg bg-background/60 border border-border/60 p-3" />
                <select name="type" className="rounded-lg bg-background/60 border border-border/60 p-3" defaultValue="meeting" required>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select name="relatedTaskId" className="rounded-lg bg-background/60 border border-border/60 p-3">
                  <option value="">Link task (opcional)</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.type} #{task.id}
                    </option>
                  ))}
                </select>
                <select name="relatedApprovalId" className="rounded-lg bg-background/60 border border-border/60 p-3">
                  <option value="">Link approval</option>
                  {approvals.map((approval) => (
                    <option key={approval.id} value={approval.id}>
                      {approval.title}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold py-3">
                Programar
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-primary" />
              Próximos eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground">No hay eventos próximos.</p>
            )}
            {upcoming.map((event) => (
              <EventManagementItem key={event.id} event={event} tasks={tasks} approvals={approvals} />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Task alignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{tasks.filter((task) => task.status === 'running').length} tareas en ejecución sincronizadas.</p>
            <p className="text-muted-foreground">{tasks.filter((task) => task.status === 'queued').length} tareas en cola dentro del horizonte semanal.</p>
          </CardContent>
        </Card>
        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Approval checkpoints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{approvals.filter((approval) => approval.status === 'pending').length} aprobaciones pendientes aguardando agenda.</p>
            <p className="text-muted-foreground">{approvals.filter((approval) => approval.status === 'approved').length} aprobaciones listas para ejecución.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function EventManagementItem({ event, tasks, approvals }: { event: CalendarEventRecord; tasks: ReturnType<typeof getTasks>; approvals: ReturnType<typeof getApprovals> }) {
  return (
    <div className="rounded-xl border border-border/40 p-4 bg-background/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{event.title}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {event.date} • {event.time}
          </p>
        </div>
        <EventTypeBadge type={event.type} />
      </div>
      {event.description && <p className="text-sm text-muted-foreground mt-2">{event.description}</p>}
      <details className="mt-3 rounded-lg bg-muted/20">
        <summary className="px-3 py-2 text-sm font-semibold cursor-pointer flex items-center gap-2">
          <Timer className="w-3 h-3" /> Editar
        </summary>
        <div className="p-3 border-t border-border/40 space-y-2">
          <form action={updateEventAction} className="space-y-2 text-sm">
            <input type="hidden" name="eventId" value={event.id} />
            <input type="text" name="title" defaultValue={event.title} className="w-full rounded-lg bg-background/60 border border-border/60 p-2" />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" name="date" defaultValue={event.date} className="rounded-lg bg-background/60 border border-border/60 p-2" />
              <input type="time" name="time" defaultValue={event.time} className="rounded-lg bg-background/60 border border-border/60 p-2" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" name="duration" defaultValue={event.duration} className="rounded-lg bg-background/60 border border-border/60 p-2" />
              <select name="type" defaultValue={event.type} className="rounded-lg bg-background/60 border border-border/60 p-2">
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>
            <textarea name="description" defaultValue={event.description} className="w-full rounded-lg bg-background/60 border border-border/60 p-2" />
            <select name="relatedTaskId" defaultValue={event.relatedTaskId || ''} className="w-full rounded-lg bg-background/60 border border-border/60 p-2">
              <option value="">Link task</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.type} #{task.id}
                </option>
              ))}
            </select>
            <select name="relatedApprovalId" defaultValue={event.relatedApprovalId || ''} className="w-full rounded-lg bg-background/60 border border-border/60 p-2">
              <option value="">Link approval</option>
              {approvals.map((approval) => (
                <option key={approval.id} value={approval.id}>
                  {approval.title}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button type="submit" className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/40 font-semibold">
                Guardar
              </button>
            </div>
          </form>
          <form action={deleteEventAction} className="mt-2 flex justify-end">
            <input type="hidden" name="eventId" value={event.id} />
            <button type="submit" className="px-4 py-2 rounded-lg border border-red-500/40 text-red-300">
              Eliminar
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}

function EventTypeBadge({ type }: { type: CalendarEventType }) {
  const palette: Record<CalendarEventType, string> = {
    meeting: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40',
    deadline: 'bg-red-500/15 text-red-300 border border-red-500/40',
    reminder: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/40',
  };
  return <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', palette[type])}>{type}</span>;
}

function MetricPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 text-sm">
      <span className={cn('font-semibold', color)}>{value}</span>
      <span>{label}</span>
    </div>
  );
}

function startOfWeek(date: Date) {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = (day + 6) % 7; // Monday start
  newDate.setDate(newDate.getDate() - diff);
  return newDate;
}

function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function toISODate(date: Date) {
  return date.toISOString().split('T')[0];
}

function formatDayName(date: Date) {
  return date.toLocaleDateString('es-PE', { weekday: 'short' });
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' });
}

function startOfDay(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}
