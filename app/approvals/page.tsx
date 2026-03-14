import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getApprovals, ApprovalRecord, ApprovalPriority } from '@/lib/approval-store';
import { approveRequestAction, rejectRequestAction, editRequestAction } from './actions';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import {
  CheckCircle2,
  XOctagon,
  PencilLine,
  ShieldCheck,
  Bell,
  Filter,
  Clock3,
  Inbox,
  User,
  AlertTriangle,
} from 'lucide-react';

const priorityConfig: Record<ApprovalPriority, { label: string; classes: string }> = {
  high: { label: 'High', classes: 'bg-red-500/15 text-red-300 border border-red-500/40' },
  medium: { label: 'Medium', classes: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/40' },
  low: { label: 'Low', classes: 'bg-blue-500/15 text-blue-300 border border-blue-500/40' },
};

const statusBadge: Record<ApprovalRecord['status'], string> = {
  pending: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40',
  approved: 'bg-green-500/15 text-green-300 border border-green-500/40',
  rejected: 'bg-red-500/15 text-red-300 border border-red-500/40',
};

const priorityFilters: Array<{ id: 'all' | ApprovalPriority; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

type PageProps = {
  searchParams?: {
    priority?: ApprovalPriority | 'all';
  };
};

export default async function ApprovalsPage({ searchParams }: PageProps) {
  const approvals = await getApprovals();
  const selectedPriority = (searchParams?.priority ?? 'all') as 'all' | ApprovalPriority;

  const pending = approvals.filter(
    (approval) =>
      approval.status === 'pending' && (selectedPriority === 'all' || approval.priority === selectedPriority),
  );
  const history = approvals.filter((approval) => approval.status !== 'pending');

  const stats = {
    total: approvals.length,
    pending: approvals.filter((a) => a.status === 'pending').length,
    approved: approvals.filter((a) => a.status === 'approved').length,
    rejected: approvals.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Approvals</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Human Approval Workflow</h1>
          <p className="text-muted-foreground max-w-3xl">
            Supervisa solicitudes críticas, aplica acciones de aprobación o rechazo con comentarios auditables y mantén un historial transparente para todo el equipo.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <MetricPill icon={<Inbox className="w-4 h-4" />} label="Pendientes" value={stats.pending} />
          <MetricPill icon={<CheckCircle2 className="w-4 h-4" />} label="Aprobadas" value={stats.approved} variant="success" />
          <MetricPill icon={<XOctagon className="w-4 h-4" />} label="Rechazadas" value={stats.rejected} variant="danger" />
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4 text-primary" />
            Filtrar por prioridad
          </div>
          <div className="flex flex-wrap gap-2">
            {priorityFilters.map((filter) => (
              <FilterChip key={filter.id} label={filter.label} active={selectedPriority === filter.id} href={`/approvals${filter.id === 'all' ? '' : `?priority=${filter.id}`}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {pending.length === 0 && (
            <Card className="glass-panel border border-border/60 xl:col-span-2">
              <CardContent className="p-10 text-center text-muted-foreground flex flex-col items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <p>No hay aprobaciones pendientes con este filtro.</p>
              </CardContent>
            </Card>
          )}

          {pending.map((approval) => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="w-4 h-4 text-accent" />
          Historial de aprobaciones procesadas
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {history.map((approval) => (
            <Card key={approval.id} className="glass-panel border border-border/60">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{approval.title}</span>
                  <span className={cn('px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2', statusBadge[approval.status])}>
                    {approval.status}
                  </span>
                </CardTitle>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <User className="w-3 h-3" /> {approval.requester}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <span className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold', priorityConfig[approval.priority].classes)}>
                  Prioridad {priorityConfig[approval.priority].label}
                </span>
                <AuditTrail entries={approval.history.slice(0, 4)} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function ApprovalCard({ approval }: { approval: ApprovalRecord }) {
  return (
    <Card className="glass-panel border border-border/60">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center justify-between">
          <span>{approval.title}</span>
          <span className={cn('px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2', statusBadge[approval.status])}>
            {approval.status}
          </span>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4 text-primary" /> Solicita: {approval.requester}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock3 className="w-3 h-3" /> {approval.createdAt}
        </div>
        <span className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit', priorityConfig[approval.priority].classes)}>
          Prioridad {priorityConfig[approval.priority].label}
        </span>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3">
          <form action={approveRequestAction} className="rounded-xl border border-border/50 bg-background/40 p-4 space-y-3">
            <input type="hidden" name="approvalId" value={approval.id} />
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Comentario (opcional)</label>
            <input
              type="text"
              name="comment"
              placeholder="Ej: listo para deploy"
              className="w-full rounded-lg bg-background/60 border border-border/60 p-2 text-sm"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-300 border border-green-500/40 font-semibold hover:bg-green-500/30 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Aprobar solicitud
            </button>
          </form>

          <form action={rejectRequestAction} className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-3">
            <input type="hidden" name="approvalId" value={approval.id} />
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Motivo de rechazo</label>
            <textarea
              name="comment"
              placeholder="Describe por qué se rechaza"
              className="w-full rounded-lg bg-background/80 border border-red-500/30 p-2 text-sm min-h-20"
              required
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 font-semibold hover:bg-red-500/30 transition"
            >
              <XOctagon className="w-4 h-4" /> Rechazar solicitud
            </button>
          </form>
        </div>

        <details className="rounded-xl border border-border/50 bg-background/30" open>
          <summary className="cursor-pointer px-4 py-3 flex items-center justify-between text-sm font-semibold">
            Editar solicitud
            <PencilLine className="w-4 h-4 text-accent" />
          </summary>
          <div className="p-4 border-t border-border/30 space-y-3">
            <form action={editRequestAction} className="space-y-3">
              <input type="hidden" name="approvalId" value={approval.id} />
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Título</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={approval.title}
                  className="w-full rounded-lg bg-background/60 border border-border/60 p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Solicitante</label>
                <input
                  type="text"
                  name="requester"
                  defaultValue={approval.requester}
                  className="w-full rounded-lg bg-background/60 border border-border/60 p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Prioridad</label>
                <select
                  name="priority"
                  defaultValue={approval.priority}
                  className="w-full rounded-lg bg-background/60 border border-border/60 p-2 text-sm"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Comentario de edición</label>
                <textarea
                  name="comment"
                  placeholder="Explica el ajuste solicitado"
                  className="w-full rounded-lg bg-background/60 border border-border/60 p-2 text-sm min-h-20"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent/20 text-accent border border-accent/40 font-semibold hover:bg-accent/30 transition"
              >
                <PencilLine className="w-4 h-4" /> Guardar cambios
              </button>
            </form>
          </div>
        </details>

        <AuditTrail entries={approval.history.slice(0, 3)} />
      </CardContent>
    </Card>
  );
}

function MetricPill({ icon, label, value, variant = 'default' }: { icon: ReactNode; label: string; value: number; variant?: 'default' | 'success' | 'danger'; }) {
  const palette = {
    default: 'border-border/60 text-muted-foreground',
    success: 'border-green-500/40 text-green-300',
    danger: 'border-red-500/40 text-red-300',
  };

  return (
    <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full border text-sm', palette[variant])}>
      {icon}
      <span className="font-semibold text-foreground">{value}</span>
      {label}
    </div>
  );
}

function FilterChip({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 rounded-full border text-sm transition-all',
        active ? 'border-primary text-primary bg-primary/10' : 'border-border/60 text-muted-foreground hover:border-primary/40'
      )}
    >
      {label}
    </Link>
  );
}

function AuditTrail({ entries }: { entries: ApprovalRecord['history'] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-border/40 bg-background/40 p-4 text-sm text-muted-foreground">
        No hay eventos registrados todavía.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/40 bg-background/40 p-4 space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-start gap-3">
          <StatusIcon action={entry.action} />
          <div>
            <p className="text-sm">
              <span className="font-semibold">{entry.actor}</span> {describeAction(entry.action)}
            </p>
            {entry.comment && <p className="text-xs text-muted-foreground">{entry.comment}</p>}
            <p className="text-[11px] text-muted-foreground mt-1">{formatTimestamp(entry.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusIcon({ action }: { action: ApprovalRecord['history'][number]['action'] }) {
  const iconMap: Record<string, ReactNode> = {
    approved: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    rejected: <XOctagon className="w-4 h-4 text-red-400" />,
    edited: <PencilLine className="w-4 h-4 text-accent" />,
    created: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  };

  return <span>{iconMap[action]}</span>;
}

function describeAction(action: ApprovalRecord['history'][number]['action']) {
  switch (action) {
    case 'approved':
      return 'aprobó la solicitud.';
    case 'rejected':
      return 'rechazó la solicitud.';
    case 'edited':
      return 'editó y reenvió la solicitud.';
    default:
      return 'creó la solicitud.';
  }
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });
}
