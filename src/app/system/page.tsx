import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemSnapshot, ServiceRecord, ServiceStatus, SystemAlertRecord } from '@/lib/system-store';
import { createSystemAlertAction, resolveAlertAction, restartServiceAction, setServiceStatusAction } from './actions';
import { cn } from '@/lib/utils';
import { Activity, Cpu, HardDrive, Layers, RefreshCcw, ShieldAlert, Siren } from 'lucide-react';
import type { ReactNode } from 'react';

const serviceStatusStyle: Record<ServiceStatus, string> = {
  healthy: 'border-green-500/40 text-green-300 bg-green-500/10',
  degraded: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
  down: 'border-red-500/40 text-red-300 bg-red-500/10',
  maintenance: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
};

const alertStyle: Record<SystemAlertRecord['severity'], string> = {
  info: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
  warning: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
  critical: 'border-red-500/40 text-red-300 bg-red-500/10',
};

export default function SystemPage() {
  const snapshot = getSystemSnapshot();
  const openAlerts = snapshot.alerts.filter((alert) => alert.status === 'open').length;

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / System</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">System Reliability Center</h1>
          <p className="text-muted-foreground max-w-3xl">
            Monitorea servicios críticos, administra alertas y ejecuta acciones de mitigación.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Metric icon={<Cpu className="w-4 h-4" />} label="CPU" value={`${snapshot.metrics.cpu}%`} />
          <Metric icon={<Activity className="w-4 h-4" />} label="Memory" value={`${snapshot.metrics.memory}%`} />
          <Metric icon={<HardDrive className="w-4 h-4" />} label="Disk" value={`${snapshot.metrics.disk}%`} />
          <Metric icon={<Layers className="w-4 h-4" />} label="Queue" value={snapshot.metrics.queueDepth.toLocaleString()} />
          <Metric icon={<ShieldAlert className="w-4 h-4" />} label="Open alerts" value={openAlerts} />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-panel border border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle>Service map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.services.map((service) => (
              <ServiceRow key={service.id} service={service} />
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Siren className="w-4 h-4 text-accent" />
              Create alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createSystemAlertAction} className="space-y-3">
              <select name="serviceId" className="w-full rounded-lg bg-background/60 border border-border/60 p-3" required>
                {snapshot.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <select name="severity" defaultValue="warning" className="w-full rounded-lg bg-background/60 border border-border/60 p-3">
                <option value="info">info</option>
                <option value="warning">warning</option>
                <option value="critical">critical</option>
              </select>
              <textarea
                name="message"
                placeholder="Describe la alerta manual"
                className="w-full rounded-lg bg-background/60 border border-border/60 p-3 min-h-24"
                required
              />
              <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold py-3">
                Registrar alerta
              </button>
            </form>
          </CardContent>
        </Card>
      </section>

      <Card className="glass-panel border border-border/60">
        <CardHeader>
          <CardTitle>Alert timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.alerts.map((alert) => (
            <div key={alert.id} className="rounded-lg border border-border/40 p-3 bg-background/30 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <p className="font-semibold">{alert.message}</p>
                <p className="text-xs text-muted-foreground">
                  {snapshot.services.find((service) => service.id === alert.serviceId)?.name || alert.serviceId} • {formatTimestamp(alert.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('px-3 py-1 rounded-full text-xs border', alertStyle[alert.severity])}>
                  {alert.severity}
                </span>
                <span className="px-3 py-1 rounded-full text-xs border border-border/40">{alert.status}</span>
                {alert.status === 'open' && (
                  <form action={resolveAlertAction}>
                    <input type="hidden" name="alertId" value={alert.id} />
                    <button type="submit" className="px-3 py-2 rounded-lg border border-green-500/40 text-green-300 text-xs">
                      Resolver
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ServiceRow({ service }: { service: ServiceRecord }) {
  return (
    <div className="rounded-xl border border-border/40 p-4 bg-background/40 space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <p className="font-semibold text-lg">{service.name}</p>
          <p className="text-xs text-muted-foreground">Owner: {service.owner} • Uptime: {service.uptime}</p>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs border', serviceStatusStyle[service.status])}>
          {service.status}
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <StatBox label="Latency" value={`${service.latencyMs}ms`} />
        <StatBox label="Error rate" value={`${service.errorRate}%`} />
        <StatBox label="Throughput" value={`${service.throughput}/m`} />
        <StatBox label="Check" value={formatTimestamp(service.lastCheckedAt)} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <form action={setServiceStatusAction} className="flex items-center gap-2">
          <input type="hidden" name="serviceId" value={service.id} />
          <select name="status" defaultValue={service.status} className="flex-1 rounded-lg bg-background/60 border border-border/60 p-2 text-xs">
            <option value="healthy">healthy</option>
            <option value="degraded">degraded</option>
            <option value="down">down</option>
            <option value="maintenance">maintenance</option>
          </select>
          <button type="submit" className="px-3 py-2 rounded-lg border border-border/40 text-xs">
            Guardar
          </button>
        </form>
        <form action={restartServiceAction}>
          <input type="hidden" name="serviceId" value={service.id} />
          <button type="submit" className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-primary/40 text-primary py-2 text-xs">
            <RefreshCcw className="w-3 h-3" />
            Restart
          </button>
        </form>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 p-3">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
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
