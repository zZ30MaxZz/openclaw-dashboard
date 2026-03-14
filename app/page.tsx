import { Card } from '@/components/ui/card';
import { 
  Activity, 
  Cpu, 
  MemoryStick, 
  Network, 
  PlayCircle, 
  PauseCircle, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FolderOpen,
  Calendar,
  MessageSquare,
  Terminal
} from 'lucide-react';
import { 
  agents, 
  tasks, 
  approvals, 
  memoryUsage, 
  projects, 
  calendarEvents, 
  activities,
  systemMetrics 
} from '@/lib/data';

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    idle: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: <Clock className="w-3 h-3" /> },
    running: { color: 'text-green-400', bg: 'bg-green-400/10', icon: <PlayCircle className="w-3 h-3" /> },
    paused: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: <PauseCircle className="w-3 h-3" /> },
    error: { color: 'text-red-400', bg: 'bg-red-400/10', icon: <AlertCircle className="w-3 h-3" /> },
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: <Clock className="w-3 h-3" /> },
    approved: { color: 'text-green-400', bg: 'bg-green-400/10', icon: <CheckCircle className="w-3 h-3" /> },
    rejected: { color: 'text-red-400', bg: 'bg-red-400/10', icon: <AlertCircle className="w-3 h-3" /> },
    queued: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: <Clock className="w-3 h-3" /> },
    completed: { color: 'text-green-400', bg: 'bg-green-400/10', icon: <CheckCircle className="w-3 h-3" /> },
    failed: { color: 'text-red-400', bg: 'bg-red-400/10', icon: <AlertCircle className="w-3 h-3" /> },
  };
  
  const { color, bg, icon } = config[status] || { color: 'text-gray-400', bg: 'bg-gray-400/10', icon: null };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Progress bar
function ProgressBar({ value, color = 'primary' }: { value: number; color?: 'primary' | 'secondary' | 'accent' }) {
  const colorClass = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
  }[color];
  
  return (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
      <div 
        className={`h-full rounded-full ${colorClass} transition-all duration-300`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-8 grid-bg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground">Real‑time overview of your OpenClaw AI orchestration platform</p>
      </div>
      
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <p className="text-2xl font-bold">{systemMetrics.cpuUsage}%</p>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
          </div>
          <ProgressBar value={systemMetrics.cpuUsage} color="primary" />
        </Card>
        
        <Card className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Memory Usage</p>
              <p className="text-2xl font-bold">{systemMetrics.memoryUsage}%</p>
            </div>
            <div className="p-3 rounded-full bg-secondary/10">
              <MemoryStick className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <ProgressBar value={systemMetrics.memoryUsage} color="secondary" />
        </Card>
        
        <Card className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Network In</p>
              <p className="text-2xl font-bold">{systemMetrics.networkIn} Mbps</p>
            </div>
            <div className="p-3 rounded-full bg-accent/10">
              <Network className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">Live throughput</div>
        </Card>
        
        <Card className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-2xl font-bold">{systemMetrics.uptime}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500/10">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">Since last restart</div>
        </Card>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Agents */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Active Agents ({agents.length})
              </h2>
              <button className="text-sm text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Terminal className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.tasks} tasks • {agent.cpu}% CPU</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={agent.status} />
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Last active</p>
                      <p className="text-sm">{agent.lastActive}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Running Tasks */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Terminal className="w-5 h-5 text-secondary" />
                Task Queue
              </h2>
              <div className="flex gap-2">
                <span className="text-sm px-2 py-1 rounded-full bg-green-400/10 text-green-400">
                  {tasks.filter(t => t.status === 'running').length} running
                </span>
                <span className="text-sm px-2 py-1 rounded-full bg-yellow-400/10 text-yellow-400">
                  {tasks.filter(t => t.status === 'queued').length} queued
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{task.type}</span>
                      <span className="text-xs text-muted-foreground">• Agent {task.agentId}</span>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <ProgressBar value={task.progress} color="accent" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Created: {task.createdAt}</span>
                    <span>Updated: {task.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Pending Approvals
              </h2>
              <span className="text-sm px-2 py-1 rounded-full bg-accent/10 text-accent">
                {approvals.filter(a => a.status === 'pending').length} pending
              </span>
            </div>
            <div className="space-y-3">
              {approvals.slice(0, 3).map((approval) => (
                <div key={approval.id} className="p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{approval.title}</h3>
                    <StatusBadge status={approval.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Requested by {approval.requester}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${approval.priority === 'high' ? 'bg-red-500/20 text-red-400' : approval.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {approval.priority} priority
                    </span>
                    <span className="text-xs text-muted-foreground">{approval.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
              + New approval request
            </button>
          </Card>
          
          {/* Memory Usage */}
          <Card className="glass-panel p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <MemoryStick className="w-5 h-5 text-primary" />
              Memory Usage
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Vector Store</span>
                  <span className="font-medium">{memoryUsage.used}GB / {memoryUsage.total}GB</span>
                </div>
                <ProgressBar value={(memoryUsage.used / memoryUsage.total) * 100} color="primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{memoryUsage.collections}</p>
                  <p className="text-xs text-muted-foreground">Collections</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">Embedding Models</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Projects Overview */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-secondary" />
                Projects Overview
              </h2>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{project.name}</span>
                    <span>{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} color="secondary" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{project.tasks} tasks</span>
                    <span>{project.agents} agents</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Calendar Events */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Upcoming Events
              </h2>
              <button className="text-sm text-accent hover:underline">View calendar</button>
            </div>
            <div className="space-y-3">
              {calendarEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={`w-2 h-10 rounded-full ${event.type === 'meeting' ? 'bg-primary' : event.type === 'deadline' ? 'bg-accent' : 'bg-secondary'}`} />
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Global Activity Stream */}
      <Card className="glass-panel p-6 mt-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          Global Activity Stream
        </h2>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p>
                  <span className="font-medium">{activity.agent}</span>
                  <span className="text-muted-foreground"> {activity.action}</span>
                </p>
              </div>
              <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}