import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { agents } from '@/lib/data';
import { Bot, Play, Pause, RefreshCw, AlertTriangle, Cpu, MemoryStick, Activity, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  idle: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: <Pause className="w-4 h-4" />, label: 'Idle' },
  running: { color: 'text-green-400', bg: 'bg-green-400/10', icon: <Play className="w-4 h-4" />, label: 'Running' },
  paused: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: <Pause className="w-4 h-4" />, label: 'Paused' },
  error: { color: 'text-red-400', bg: 'bg-red-400/10', icon: <AlertTriangle className="w-4 h-4" />, label: 'Error' },
};

export default function AgentsPage() {
  const totalAgents = agents.length;
  const runningAgents = agents.filter(a => a.status === 'running').length;
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasks, 0);

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Agents</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Agent Orchestration</h1>
          <p className="text-muted-foreground max-w-2xl">
            Monitor and manage your OpenClaw AI agents. View status, assign tasks, and control agent lifecycle in real-time.
          </p>
        </div>
        <Card className="glass-panel border border-border/60 w-full lg:w-auto">
          <CardContent className="p-5 flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Active agents</span>
            <span className="text-3xl font-bold text-primary">{runningAgents}/{totalAgents}</span>
          </CardContent>
        </Card>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold">{totalAgents}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Bot className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
              <div className="p-3 rounded-full bg-secondary/10">
                <Terminal className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg CPU</p>
                <p className="text-2xl font-bold">
                  {Math.round(agents.reduce((sum, a) => sum + a.cpu, 0) / agents.length)}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-accent/10">
                <Cpu className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Memory</p>
                <p className="text-2xl font-bold">
                  {Math.round(agents.reduce((sum, a) => sum + a.memory, 0) / agents.length)}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <MemoryStick className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <Card className="glass-panel border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Agent Fleet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Agent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tasks</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">CPU</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Memory</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => {
                  const status = statusConfig[agent.status];
                  return (
                    <tr key={agent.id} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {agent.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                          status.bg,
                          status.color
                        )}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{agent.tasks}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{agent.cpu}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MemoryStick className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{agent.memory}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{agent.lastActive}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg border border-border hover:bg-green-500/10 hover:text-green-400 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg border border-border hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors">
                            <Pause className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg border border-border hover:bg-blue-500/10 hover:text-blue-400 transition-colors">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel border border-border/50">
          <CardHeader>
            <CardTitle>Agent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agents.slice(0, 3).map((agent) => (
                <div key={agent.id} className="p-3 rounded-lg border border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-xs text-muted-foreground">{agent.lastActive}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Agent {agent.status === 'running' ? 'is processing tasks' : 'is idle'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50">
          <CardHeader>
            <CardTitle>Task Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-dashed border-border text-center hover:border-primary/50 transition-colors cursor-pointer">
                <p className="text-muted-foreground">Assign new task to agent</p>
              </div>
              <div className="text-sm text-muted-foreground">
                Select an agent and assign a task from the queue.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}