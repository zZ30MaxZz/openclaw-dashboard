export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'maintenance';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface ServiceRecord {
  id: string;
  name: string;
  owner: string;
  status: ServiceStatus;
  latencyMs: number;
  errorRate: number;
  uptime: string;
  throughput: number;
  lastCheckedAt: string;
}

export interface SystemAlertRecord {
  id: string;
  serviceId: string;
  severity: AlertSeverity;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  queueDepth: number;
}

let serviceStore: ServiceRecord[] = [
  {
    id: 'svc-gateway',
    name: 'Gateway',
    owner: 'Runtime',
    status: 'healthy',
    latencyMs: 82,
    errorRate: 0.4,
    uptime: '21d 7h',
    throughput: 1280,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'svc-queue',
    name: 'Worker Queue',
    owner: 'Mission Ops',
    status: 'degraded',
    latencyMs: 210,
    errorRate: 2.7,
    uptime: '8d 2h',
    throughput: 740,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'svc-vector',
    name: 'Vector Store',
    owner: 'Memory',
    status: 'healthy',
    latencyMs: 95,
    errorRate: 0.8,
    uptime: '33d 5h',
    throughput: 910,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'svc-webhooks',
    name: 'Webhook Relay',
    owner: 'Integrations',
    status: 'maintenance',
    latencyMs: 0,
    errorRate: 0,
    uptime: '0d 0h',
    throughput: 0,
    lastCheckedAt: new Date().toISOString(),
  },
];

let alertStore: SystemAlertRecord[] = [
  {
    id: 'al-1',
    serviceId: 'svc-queue',
    severity: 'warning',
    message: 'Queue depth above 12k for 10 minutes',
    status: 'open',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'al-2',
    serviceId: 'svc-webhooks',
    severity: 'info',
    message: 'Planned maintenance window in progress',
    status: 'open',
    createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
  },
];

let metrics: SystemMetrics = {
  cpu: 68,
  memory: 74,
  disk: 59,
  queueDepth: 12430,
};

export function getSystemSnapshot() {
  return {
    services: serviceStore.slice(),
    alerts: alertStore.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    metrics: { ...metrics },
  };
}

export function restartService(serviceId: string) {
  const index = serviceStore.findIndex((service) => service.id === serviceId);
  if (index === -1) throw new Error(`Service ${serviceId} not found`);

  const base = serviceStore[index];
  serviceStore = [
    ...serviceStore.slice(0, index),
    {
      ...base,
      status: 'healthy',
      latencyMs: Math.max(55, base.latencyMs - 60),
      errorRate: Math.max(0, Number((base.errorRate - 0.9).toFixed(1))),
      throughput: base.throughput > 0 ? base.throughput + 90 : 320,
      lastCheckedAt: new Date().toISOString(),
    },
    ...serviceStore.slice(index + 1),
  ];
}

export function setServiceStatus(serviceId: string, status: ServiceStatus) {
  const index = serviceStore.findIndex((service) => service.id === serviceId);
  if (index === -1) throw new Error(`Service ${serviceId} not found`);
  serviceStore = [
    ...serviceStore.slice(0, index),
    { ...serviceStore[index], status, lastCheckedAt: new Date().toISOString() },
    ...serviceStore.slice(index + 1),
  ];
}

export function resolveAlert(alertId: string) {
  const index = alertStore.findIndex((alert) => alert.id === alertId);
  if (index === -1) throw new Error(`Alert ${alertId} not found`);
  alertStore = [
    ...alertStore.slice(0, index),
    { ...alertStore[index], status: 'resolved', resolvedAt: new Date().toISOString() },
    ...alertStore.slice(index + 1),
  ];
}

export function createSystemAlert(serviceId: string, severity: AlertSeverity, message: string) {
  const alert: SystemAlertRecord = {
    id: crypto.randomUUID(),
    serviceId,
    severity,
    message,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  alertStore = [alert, ...alertStore];
}
