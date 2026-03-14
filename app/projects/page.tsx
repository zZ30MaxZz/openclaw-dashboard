import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjects, ProjectRecord } from '@/lib/project-store';
import { getTasks } from '@/lib/task-store';
import { getAgentsWithLogs } from '@/lib/agent-store';
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  assignTaskToProjectAction,
  assignAgentToProjectAction,
} from './actions';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  FolderKanban,
  LineChart,
  Users,
  Target,
  Calendar as CalendarIcon,
  Link2,
  Rocket,
} from 'lucide-react';

export default function ProjectsPage() {
  const projects = getProjects();
  const tasks = getTasks();
  const agents = getAgentsWithLogs();

  const statusCounts = {
    'on-track': projects.filter((project) => project.status === 'on-track').length,
    'at-risk': projects.filter((project) => project.status === 'at-risk').length,
    blocked: projects.filter((project) => project.status === 'blocked').length,
  };

  const totalProgress = Math.round(
    projects.reduce((acc, project) => acc + project.progress, 0) / (projects.length || 1),
  );

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Projects</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Project Operations Hub</h1>
          <p className="text-muted-foreground max-w-3xl">
            Supervisa cada iniciativa con métricas en tiempo real, asigna tareas y agentes, y mantén visibilidad de progreso.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <StatusStat label="On Track" value={statusCounts['on-track']} badgeClass="text-green-300" />
          <StatusStat label="At Risk" value={statusCounts['at-risk']} badgeClass="text-yellow-300" />
          <StatusStat label="Blocked" value={statusCounts.blocked} badgeClass="text-red-300" />
          <StatusStat label="Avg Progress" value={`${totalProgress}%`} badgeClass="text-cyan-300" />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-accent" />
              Crear proyecto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createProjectAction} className="space-y-3">
              <input type="text" name="name" placeholder="Nombre del proyecto" className="w-full rounded-lg bg-background/60 border border-border/60 p-3" required />
              <textarea name="description" placeholder="Descripción" className="w-full rounded-lg bg-background/60 border border-border/60 p-3" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="owner" placeholder="Owner" className="rounded-lg bg-background/60 border border-border/60 p-3" />
                <select name="status" defaultValue="on-track" className="rounded-lg bg-background/60 border border-border/60 p-3">
                  <option value="on-track">On track</option>
                  <option value="at-risk">At risk</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" name="progress" placeholder="% progreso" min={0} max={100} className="rounded-lg bg-background/60 border border-border/60 p-3" />
                <input type="date" name="deadline" className="rounded-lg bg-background/60 border border-border/60 p-3" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" name="tasks" placeholder="# tareas" className="rounded-lg bg-background/60 border border-border/60 p-3" />
                <input type="number" name="agents" placeholder="# agentes" className="rounded-lg bg-background/60 border border-border/60 p-3" />
              </div>
              <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold py-3">
                Lanzar proyecto
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-primary" />
              Resumen portfolio
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <ProgressSummary label="Capacidad" value={totalProgress} />
              <p className="text-sm text-muted-foreground">
                {projects.length} proyectos activos • {tasks.length} tareas globales • {agents.length} agentes disponibles
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground"><LineChart className="w-4 h-4 text-secondary" /> Integrado con Tasks y Agents</p>
              <p className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4 text-primary" /> Capacidad de agentes en vivo</p>
              <p className="flex items-center gap-2 text-muted-foreground"><Target className="w-4 h-4 text-accent" /> Deadlines sincronizados</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} tasks={tasks} agents={agents.map((agent) => agent.name)} />
        ))}
      </section>
    </div>
  );
}

function ProjectCard({ project, tasks, agents }: { project: ProjectRecord; tasks: ReturnType<typeof getTasks>; agents: string[] }) {
  const relatedTasks = project.linkedTasks
    .map((taskId) => tasks.find((task) => task.id === taskId)?.type || `Task ${taskId.slice(0, 4)}`)
    .slice(0, 4);

  return (
    <Card className="glass-panel border border-border/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <LineChart className="w-5 h-5 text-secondary" />
              {project.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Owner: {project.owner}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Metric label="Tasks" value={project.tasks} icon={<Link2 className="w-4 h-4 text-primary" />} />
          <Metric label="Agents" value={project.agents} icon={<Users className="w-4 h-4 text-secondary" />} />
          <Metric label="Deadline" value={project.deadline} icon={<CalendarIcon className="w-4 h-4 text-accent" />} />
          <Metric label="Status" value={project.status} icon={<Target className="w-4 h-4 text-green-400" />} />
        </div>

        {relatedTasks.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs">
            {relatedTasks.map((task) => (
              <span key={task} className="px-3 py-1 rounded-full border border-border/40">
                {task}
              </span>
            ))}
          </div>
        )}

        {project.linkedAgents.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs">
            {project.linkedAgents.slice(0, 4).map((agent) => (
              <span key={agent} className="px-3 py-1 rounded-full border border-border/40 text-secondary">
                {agent}
              </span>
            ))}
          </div>
        )}

        <details className="rounded-xl border border-border/40 bg-background/30" open>
          <summary className="px-4 py-3 cursor-pointer text-sm font-semibold">Actualizar progreso</summary>
          <div className="p-4 border-t border-border/40 space-y-3 text-sm">
            <form action={updateProjectAction} className="space-y-3">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="text" name="name" defaultValue={project.name} className="w-full rounded-lg bg-background/60 border border-border/60 p-2" />
              <textarea name="description" defaultValue={project.description} className="w-full rounded-lg bg-background/60 border border-border/60 p-2" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" name="progress" defaultValue={project.progress} min={0} max={100} className="rounded-lg bg-background/60 border border-border/60 p-2" />
                <select name="status" defaultValue={project.status} className="rounded-lg bg-background/60 border border-border/60 p-2">
                  <option value="on-track">On track</option>
                  <option value="at-risk">At risk</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" name="owner" defaultValue={project.owner} className="rounded-lg bg-background/60 border border-border/60 p-2" />
                <input type="date" name="deadline" defaultValue={project.deadline} className="rounded-lg bg-background/60 border border-border/60 p-2" />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/40 font-semibold">
                  Guardar
                </button>
              </div>
            </form>
            <form action={deleteProjectAction} className="flex justify-end">
              <input type="hidden" name="projectId" value={project.id} />
              <button type="submit" className="px-4 py-2 rounded-lg border border-red-500/40 text-red-300">
                Eliminar
              </button>
            </form>
          </div>
        </details>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
          <form action={assignTaskToProjectAction} className="space-y-2">
            <input type="hidden" name="projectId" value={project.id} />
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Asignar task</label>
            <select name="taskId" className="w-full rounded-lg bg-background/60 border border-border/60 p-2">
              <option value="">Selecciona tarea</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.type} #{task.id}
                </option>
              ))}
            </select>
            <button type="submit" className="w-full rounded-lg border border-border/40 py-2">Asignar</button>
          </form>

          <form action={assignAgentToProjectAction} className="space-y-2">
            <input type="hidden" name="projectId" value={project.id} />
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Asignar agente</label>
            <select name="agentName" className="w-full rounded-lg bg-background/60 border border-border/60 p-2">
              <option value="">Selecciona agente</option>
              {agents.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
            <button type="submit" className="w-full rounded-lg border border-border/40 py-2">Asignar</button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: ProjectRecord['status'] }) {
  const palette: Record<ProjectRecord['status'], string> = {
    'on-track': 'bg-green-500/15 text-green-300 border border-green-500/40',
    'at-risk': 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/40',
    blocked: 'bg-red-500/15 text-red-300 border border-red-500/40',
  };
  return <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', palette[status])}>{status}</span>;
}

function Metric({ label, value, icon }: { label: string; value: ReactNode; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-border/40 p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-base font-semibold">{value}</p>
      </div>
    </div>
  );
}

function StatusStat({ label, value, badgeClass }: { label: string; value: string | number; badgeClass: string }) {
  return (
    <div className="px-4 py-2 rounded-full border border-border/60 text-sm flex items-center gap-2">
      <span className={cn('font-semibold', badgeClass)}>{value}</span>
      {label}
    </div>
  );
}

function ProgressSummary({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
