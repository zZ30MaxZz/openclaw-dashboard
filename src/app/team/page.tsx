import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamMembers, TeamMemberRecord, TeamPresence } from '@/lib/team-store';
import { createTeamMemberAction, deleteTeamMemberAction, updateTeamMemberAction } from './actions';
import { cn } from '@/lib/utils';
import { UserPlus, Users, Gauge, ShieldCheck, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

const presenceBadge: Record<TeamPresence, string> = {
  online: 'border-green-500/40 text-green-300 bg-green-500/10',
  focus: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
  offline: 'border-zinc-500/40 text-zinc-300 bg-zinc-500/10',
  'on-call': 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
};

export default function TeamPage() {
  const members = getTeamMembers();
  const onlineCount = members.filter((member) => member.presence === 'online' || member.presence === 'on-call').length;
  const onCallCount = members.filter((member) => member.presence === 'on-call').length;
  const avgLoad = Math.round(members.reduce((acc, member) => acc + member.currentLoad, 0) / (members.length || 1));

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Team</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Team Coordination Hub</h1>
          <p className="text-muted-foreground max-w-3xl">
            Gestiona disponibilidad, carga operativa y cobertura on-call del equipo.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Metric label="Miembros" value={members.length} icon={<Users className="w-4 h-4" />} />
          <Metric label="Online" value={onlineCount} icon={<ShieldCheck className="w-4 h-4" />} />
          <Metric label="On-call" value={onCallCount} icon={<Gauge className="w-4 h-4" />} />
          <Metric label="Carga media" value={`${avgLoad}%`} icon={<Gauge className="w-4 h-4" />} />
        </div>
      </header>

      <Card className="glass-panel border border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Nuevo miembro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTeamMemberAction} className="grid grid-cols-1 lg:grid-cols-7 gap-3">
            <input type="text" name="name" placeholder="Nombre" className="rounded-lg bg-background/60 border border-border/60 p-3" required />
            <input type="text" name="role" placeholder="Rol" className="rounded-lg bg-background/60 border border-border/60 p-3" required />
            <input type="text" name="squad" placeholder="Squad" className="rounded-lg bg-background/60 border border-border/60 p-3" />
            <input type="text" name="timezone" placeholder="Timezone" defaultValue="America/Lima" className="rounded-lg bg-background/60 border border-border/60 p-3" />
            <input type="number" min={0} max={100} name="capacity" defaultValue={80} className="rounded-lg bg-background/60 border border-border/60 p-3" />
            <input type="text" name="skills" placeholder="skills separadas por coma" className="rounded-lg bg-background/60 border border-border/60 p-3" />
            <button type="submit" className="rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold p-3">
              Agregar
            </button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-panel border border-border/60">
        <CardHeader>
          <CardTitle>Roster</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {members.map((member) => (
            <TeamMemberRow key={member.id} member={member} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function TeamMemberRow({ member }: { member: TeamMemberRecord }) {
  return (
    <div className="rounded-xl border border-border/40 p-4 bg-background/40 space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <p className="font-semibold text-lg">{member.name}</p>
          <p className="text-sm text-muted-foreground">
            {member.role} • {member.squad} • {member.timezone}
          </p>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs border w-fit', presenceBadge[member.presence])}>
          {member.presence}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Carga actual</span>
          <span>{member.currentLoad}% / cap {member.capacity}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent" style={{ width: `${member.currentLoad}%` }} />
        </div>
      </div>

      {member.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {member.skills.map((skill) => (
            <span key={skill} className="px-2 py-1 rounded-full border border-border/40">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <form action={updateTeamMemberAction} className="space-y-2">
          <input type="hidden" name="memberId" value={member.id} />
          <div className="grid grid-cols-3 gap-2">
            <select name="presence" defaultValue={member.presence} className="rounded-lg bg-background/60 border border-border/60 p-2 text-xs">
              <option value="online">online</option>
              <option value="focus">focus</option>
              <option value="offline">offline</option>
              <option value="on-call">on-call</option>
            </select>
            <input type="number" name="currentLoad" min={0} max={100} defaultValue={member.currentLoad} className="rounded-lg bg-background/60 border border-border/60 p-2 text-xs" />
            <input type="number" name="capacity" min={0} max={100} defaultValue={member.capacity} className="rounded-lg bg-background/60 border border-border/60 p-2 text-xs" />
          </div>
          <button type="submit" className="w-full rounded-lg border border-border/40 py-2 text-xs">
            Actualizar estado
          </button>
        </form>

        <form action={deleteTeamMemberAction} className="flex items-end">
          <input type="hidden" name="memberId" value={member.id} />
          <button type="submit" className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-red-500/40 text-red-300 py-2 text-xs">
            <Trash2 className="w-3 h-3" />
            Remover
          </button>
        </form>
      </div>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <div className="px-4 py-2 rounded-full border border-border/60 text-sm flex items-center gap-2">
      {icon}
      <span className="font-semibold text-foreground">{value}</span>
      {label}
    </div>
  );
}
