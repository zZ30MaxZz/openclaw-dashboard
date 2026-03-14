import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContentItems, ContentRecord, ContentStatus } from '@/lib/content-store';
import { createContentAction, deleteContentAction, updateContentAction } from './actions';
import { cn } from '@/lib/utils';
import { Megaphone, PenSquare, CalendarClock, Send, Rocket, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

const statusColumns: Array<{ id: ContentStatus; label: string; icon: ReactNode; color: string }> = [
  { id: 'draft', label: 'Draft', icon: <PenSquare className="w-4 h-4" />, color: 'text-slate-300' },
  { id: 'in-review', label: 'In Review', icon: <Megaphone className="w-4 h-4" />, color: 'text-yellow-300' },
  { id: 'scheduled', label: 'Scheduled', icon: <CalendarClock className="w-4 h-4" />, color: 'text-cyan-300' },
  { id: 'published', label: 'Published', icon: <Send className="w-4 h-4" />, color: 'text-green-300' },
];

const priorityBadge: Record<ContentRecord['priority'], string> = {
  low: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
  medium: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
  high: 'border-red-500/40 text-red-300 bg-red-500/10',
};

export default function ContentPage() {
  const items = getContentItems();
  const byStatus = statusColumns.reduce<Record<ContentStatus, ContentRecord[]>>(
    (acc, column) => {
      acc[column.id] = items.filter((item) => item.status === column.id);
      return acc;
    },
    { draft: [], 'in-review': [], scheduled: [], published: [] },
  );

  const published = byStatus.published.length;
  const dueSoon = items.filter((item) => {
    const diff = new Date(item.dueDate).getTime() - Date.now();
    return diff >= 0 && diff < 3 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Content</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Content Operations Desk</h1>
          <p className="text-muted-foreground max-w-3xl">
            Gestiona backlog editorial, revisiones, scheduling y publicación con trazabilidad por canal.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <StatPill label="Total" value={items.length} accent="text-primary" />
          <StatPill label="Published" value={published} accent="text-green-300" />
          <StatPill label="Due 72h" value={dueSoon} accent="text-yellow-300" />
        </div>
      </header>

      <Card className="glass-panel border border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-accent" />
            Nuevo contenido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createContentAction} className="grid grid-cols-1 lg:grid-cols-6 gap-3">
            <input
              type="text"
              name="title"
              placeholder="Título de pieza"
              className="lg:col-span-2 rounded-lg bg-background/60 border border-border/60 p-3"
              required
            />
            <input
              type="text"
              name="brief"
              placeholder="Brief corto"
              className="lg:col-span-2 rounded-lg bg-background/60 border border-border/60 p-3"
            />
            <input
              type="text"
              name="owner"
              placeholder="Owner"
              className="rounded-lg bg-background/60 border border-border/60 p-3"
            />
            <input
              type="date"
              name="dueDate"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="rounded-lg bg-background/60 border border-border/60 p-3"
            />
            <select name="channel" defaultValue="blog" className="rounded-lg bg-background/60 border border-border/60 p-3">
              <option value="blog">Blog</option>
              <option value="docs">Docs</option>
              <option value="social">Social</option>
              <option value="email">Email</option>
            </select>
            <select name="priority" defaultValue="medium" className="rounded-lg bg-background/60 border border-border/60 p-3">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" className="lg:col-span-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold p-3">
              Crear pieza
            </button>
          </form>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {statusColumns.map((column) => (
          <Card key={column.id} className="glass-panel border border-border/60 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className={cn('flex items-center gap-2', column.color)}>
                  {column.icon}
                  {column.label}
                </span>
                <span className="text-sm text-muted-foreground">{byStatus[column.id].length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {byStatus[column.id].length === 0 && (
                <div className="rounded-lg border border-dashed border-border/40 p-4 text-sm text-muted-foreground text-center">
                  Sin elementos en esta etapa.
                </div>
              )}
              {byStatus[column.id].map((item) => (
                <div key={item.id} className="rounded-xl border border-border/40 bg-background/40 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.channel.toUpperCase()} • {item.owner}</p>
                    </div>
                    <span className={cn('px-2 py-1 rounded-full text-[11px] border', priorityBadge[item.priority])}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.brief}</p>
                  <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>

                  <form action={updateContentAction} className="space-y-2">
                    <input type="hidden" name="contentId" value={item.id} />
                    <div className="grid grid-cols-2 gap-2">
                      <select name="status" defaultValue={item.status} className="rounded-lg bg-background/60 border border-border/60 p-2 text-xs">
                        {statusColumns.map((statusOption) => (
                          <option key={statusOption.id} value={statusOption.id}>
                            {statusOption.label}
                          </option>
                        ))}
                      </select>
                      <select name="priority" defaultValue={item.priority} className="rounded-lg bg-background/60 border border-border/60 p-2 text-xs">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      name="artifactUrl"
                      defaultValue={item.artifactUrl || ''}
                      placeholder="Link de artefacto/PR"
                      className="w-full rounded-lg bg-background/60 border border-border/60 p-2 text-xs"
                    />
                    <button type="submit" className="w-full rounded-lg border border-border/40 py-2 text-xs">
                      Guardar cambios
                    </button>
                  </form>

                  <form action={deleteContentAction}>
                    <input type="hidden" name="contentId" value={item.id} />
                    <button type="submit" className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-red-500/40 text-red-300 py-2 text-xs">
                      <Trash2 className="w-3 h-3" />
                      Eliminar
                    </button>
                  </form>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="px-4 py-2 rounded-full border border-border/60 text-sm flex items-center gap-2">
      <span className={cn('font-semibold', accent)}>{value}</span>
      {label}
    </div>
  );
}
