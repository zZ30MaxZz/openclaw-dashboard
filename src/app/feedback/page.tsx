import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFeedbackItems, FeedbackRecord, FeedbackStatus } from '@/lib/feedback-store';
import { createFeedbackAction, deleteFeedbackAction, updateFeedbackAction, voteFeedbackAction } from './actions';
import { cn } from '@/lib/utils';
import { MessageCircle, ThumbsUp, ClipboardList, Target, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

const statusStyle: Record<FeedbackStatus, string> = {
  new: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
  triaged: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
  planned: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
  resolved: 'border-green-500/40 text-green-300 bg-green-500/10',
};

const sentimentStyle: Record<FeedbackRecord['sentiment'], string> = {
  negative: 'text-red-300',
  neutral: 'text-slate-300',
  positive: 'text-green-300',
};

export default function FeedbackPage() {
  const feedback = getFeedbackItems();
  const stats = {
    new: feedback.filter((item) => item.status === 'new').length,
    planned: feedback.filter((item) => item.status === 'planned').length,
    resolved: feedback.filter((item) => item.status === 'resolved').length,
    votes: feedback.reduce((acc, item) => acc + item.votes, 0),
  };

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Feedback</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Feedback Triage Board</h1>
          <p className="text-muted-foreground max-w-3xl">
            Centraliza señales de usuarios, prioriza mejoras y alinea ejecución con producto.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Stat label="Nuevos" value={stats.new} icon={<MessageCircle className="w-4 h-4" />} />
          <Stat label="Planned" value={stats.planned} icon={<Target className="w-4 h-4" />} />
          <Stat label="Resolved" value={stats.resolved} icon={<ClipboardList className="w-4 h-4" />} />
          <Stat label="Votes" value={stats.votes} icon={<ThumbsUp className="w-4 h-4" />} />
        </div>
      </header>

      <Card className="glass-panel border border-border/60">
        <CardHeader>
          <CardTitle>Nuevo feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createFeedbackAction} className="grid grid-cols-1 lg:grid-cols-6 gap-3">
            <input type="text" name="title" placeholder="Título" className="lg:col-span-2 rounded-lg bg-background/60 border border-border/60 p-3" required />
            <input type="text" name="reporter" placeholder="Reporter" className="rounded-lg bg-background/60 border border-border/60 p-3" />
            <select name="category" defaultValue="feature" className="rounded-lg bg-background/60 border border-border/60 p-3">
              <option value="feature">feature</option>
              <option value="bug">bug</option>
              <option value="ux">ux</option>
              <option value="performance">performance</option>
              <option value="support">support</option>
            </select>
            <select name="priority" defaultValue="medium" className="rounded-lg bg-background/60 border border-border/60 p-3">
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <select name="sentiment" defaultValue="neutral" className="rounded-lg bg-background/60 border border-border/60 p-3">
              <option value="negative">negative</option>
              <option value="neutral">neutral</option>
              <option value="positive">positive</option>
            </select>
            <textarea name="description" placeholder="Detalles" className="lg:col-span-5 rounded-lg bg-background/60 border border-border/60 p-3 min-h-24" />
            <button type="submit" className="rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold p-3">
              Registrar
            </button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-panel border border-border/60">
        <CardHeader>
          <CardTitle>Backlog ({feedback.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackCard({ item }: { item: FeedbackRecord }) {
  return (
    <div className="rounded-xl border border-border/40 p-4 bg-background/40 space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <p className="font-semibold text-lg">{item.title}</p>
          <p className="text-sm text-muted-foreground">
            {item.category} • reporter: {item.reporter}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={cn('px-3 py-1 rounded-full border', statusStyle[item.status])}>{item.status}</span>
          <span className="px-3 py-1 rounded-full border border-border/40">{item.priority}</span>
          <span className={cn('px-3 py-1 rounded-full border border-border/40', sentimentStyle[item.sentiment])}>
            {item.sentiment}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{item.description}</p>
      <div className="text-xs text-muted-foreground">
        Votes: {item.votes} • Updated: {formatTimestamp(item.updatedAt)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <form action={voteFeedbackAction}>
          <input type="hidden" name="feedbackId" value={item.id} />
          <button type="submit" className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-primary/40 text-primary py-2 text-xs">
            <ThumbsUp className="w-3 h-3" />
            Upvote
          </button>
        </form>
        <form action={updateFeedbackAction} className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-4 gap-2">
          <input type="hidden" name="feedbackId" value={item.id} />
          <select name="status" defaultValue={item.status} className="rounded-lg bg-background/60 border border-border/60 p-2 text-xs">
            <option value="new">new</option>
            <option value="triaged">triaged</option>
            <option value="planned">planned</option>
            <option value="resolved">resolved</option>
          </select>
          <select name="priority" defaultValue={item.priority} className="rounded-lg bg-background/60 border border-border/60 p-2 text-xs">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <input
            type="text"
            name="assignedTo"
            placeholder="assignee"
            defaultValue={item.assignedTo || ''}
            className="rounded-lg bg-background/60 border border-border/60 p-2 text-xs"
          />
          <button type="submit" className="rounded-lg border border-border/40 py-2 text-xs">
            Guardar
          </button>
        </form>
      </div>

      <form action={deleteFeedbackAction}>
        <input type="hidden" name="feedbackId" value={item.id} />
        <button type="submit" className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-red-500/40 text-red-300 py-2 text-xs">
          <Trash2 className="w-3 h-3" />
          Eliminar
        </button>
      </form>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="px-4 py-2 rounded-full border border-border/60 text-sm flex items-center gap-2">
      {icon}
      <span className="font-semibold text-foreground">{value}</span>
      {label}
    </div>
  );
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
