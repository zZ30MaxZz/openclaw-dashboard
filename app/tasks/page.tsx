import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTasks } from '@/lib/task-store';
import { Task } from '@/lib/data';
import { createTaskAction, updateTaskAction, deleteTaskAction } from './actions';
import { Terminal, Play, CheckCircle2, AlertTriangle, Clock3, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const statusColumns: Array<{
  id: Task['status'];
  label: string;
  accent: string;
  description: string;
}> = [
  { id: 'queued', label: 'Queue', accent: 'text-cyan-400', description: 'Esperando agente disponible' },
  { id: 'running', label: 'Running', accent: 'text-blue-400', description: 'Ejecución activa en curso' },
  { id: 'completed', label: 'Completed', accent: 'text-green-400', description: 'Tareas finalizadas con éxito' },
  { id: 'failed', label: 'Failed', accent: 'text-red-400', description: 'Requieren atención o reintento' },
];

const statusToColor: Record<Task['status'], string> = {
  queued: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  running: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  completed: 'bg-green-500/10 text-green-300 border-green-500/30',
  failed: 'bg-red-500/10 text-red-300 border-red-500/30',
};

export default async function TasksPage() {
  const allTasks = await getTasks();
  const grouped = statusColumns.reduce<Record<Task['status'], Task[]>>((acc, column) => {
    acc[column.id] = allTasks.filter((task) => task.status === column.id);
    return acc;
  }, { queued: [], running: [], completed: [], failed: [] });

  const total = allTasks.length;

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Tasks</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Task Orchestration</h1>
          <p className="text-muted-foreground max-w-2xl">
            Monitorea y acciona sobre la cola de tareas de tus agentes. Usa las Server Actions para crear, actualizar o depurar tareas en tiempo real.
          </p>
        </div>
        <Card className="glass-panel border border-border/60 w-full lg:w-auto">
          <CardContent className="p-5 flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Total tasks</span>
            <span className="text-3xl font-bold text-primary">{total}</span>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{grouped.queued.length} queued</span>
              <span>• {grouped.running.length} running</span>
              <span>• {grouped.completed.length} completed</span>
              <span>• {grouped.failed.length} failed</span>
            </div>
          </CardContent>
        </Card>
      </header>

      <Card className="glass-panel border border-border/60">
        <CardHeader className="flex flex-col gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Nueva tarea
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Genera una nueva orden para cualquier agente. Puedes especificar el estado inicial y el progreso estimado.
            </p>
          </div>
          <CreateTaskForm />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {statusColumns.map((column) => (
          <Card key={column.id} className="glass-panel border border-border/60 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className={cn('text-lg font-semibold', column.accent)}>{column.label}</span>
                <span className="text-sm text-muted-foreground">{grouped[column.id].length} tasks</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{column.description}</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {grouped[column.id].length === 0 && (
                <div className="border border-dashed border-border/50 rounded-lg p-6 text-center text-sm text-muted-foreground">
                  No tasks in this column.
                </div>
              )}
              {grouped[column.id].map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-4 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-lg flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            {task.type}
          </p>
          <p className="text-xs text-muted-foreground">Agent #{task.agentId}</p>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs font-semibold border', statusToColor[task.status])}>
          {task.status}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Created: {formatTimestamp(task.createdAt)}</span>
        <span>Updated: {formatTimestamp(task.updatedAt)}</span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {task.status === 'queued' && (
          <ActionButton label="Start" icon={<Play className="w-3 h-3" />} status="running" taskId={task.id} progress={25} />
        )}
        {task.status !== 'completed' && (
          <ActionButton label="Complete" icon={<CheckCircle2 className="w-3 h-3" />} status="completed" taskId={task.id} progress={100} />
        )}
        {task.status !== 'failed' && (
          <ActionButton label="Fail" icon={<AlertTriangle className="w-3 h-3" />} status="failed" taskId={task.id} />
        )}
        {task.status === 'running' && (
          <ActionButton label="Queue" icon={<Clock3 className="w-3 h-3" />} status="queued" taskId={task.id} progress={0} />
        )}
        <DeleteButton taskId={task.id} />
      </div>

      <ProgressUpdateForm task={task} />
    </div>
  );
}

function ActionButton({
  label,
  icon,
  status,
  taskId,
  progress,
}: {
  label: string;
  icon: ReactNode;
  status: Task['status'];
  taskId: string;
  progress?: number;
}) {
  return (
    <form action={updateTaskAction}>
      <input type="hidden" name="taskId" value={taskId} />
      <input type="hidden" name="status" value={status} />
      {progress !== undefined && <input type="hidden" name="progress" value={progress} />}
      <button
        type="submit"
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
      >
        {icon}
        {label}
      </button>
    </form>
  );
}

function DeleteButton({ taskId }: { taskId: string }) {
  return (
    <form action={deleteTaskAction}>
      <input type="hidden" name="taskId" value={taskId} />
      <button
        type="submit"
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-all"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </button>
    </form>
  );
}

function ProgressUpdateForm({ task }: { task: Task }) {
  return (
    <form action={updateTaskAction} className="flex items-center gap-2">
      <input type="hidden" name="taskId" value={task.id} />
      <input
        type="number"
        name="progress"
        min={0}
        max={100}
        defaultValue={task.progress}
        className="flex-1 rounded-lg bg-background/60 border border-border/60 p-2 text-sm"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-semibold hover:bg-primary/30 transition-all text-sm"
      >
        Update
      </button>
    </form>
  );
}

function CreateTaskForm() {
  return (
    <form action={createTaskAction} className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full">
      <div className="lg:col-span-2">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Task name</label>
        <input
          type="text"
          name="type"
          required
          placeholder="Ej: Vector cleanup"
          className="w-full mt-1 rounded-lg bg-background/60 border border-border/60 p-3"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Agent ID</label>
        <input
          type="text"
          name="agentId"
          required
          placeholder="1"
          className="w-full mt-1 rounded-lg bg-background/60 border border-border/60 p-3"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Status</label>
        <select
          name="status"
          className="w-full mt-1 rounded-lg bg-background/60 border border-border/60 p-3"
          defaultValue="queued"
        >
          <option value="queued">Queued</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Progress</label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            name="progress"
            min={0}
            max={100}
            defaultValue={0}
            className="w-full rounded-lg bg-background/60 border border-border/60 p-3"
          />
          <button
            type="submit"
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold hover:opacity-90 transition-all"
          >
            Crear
          </button>
        </div>
      </div>
    </form>
  );
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
