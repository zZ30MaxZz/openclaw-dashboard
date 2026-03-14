import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMemoryState, searchMemories, MemoryCollection } from '@/lib/memory-store';
import { createCollectionAction, deleteCollectionAction, injectContextAction, memorySearchAction } from './actions';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Database,
  Brain,
  Gauge,
  Search,
  UploadCloud,
  Layers3,
  Trash2,
  History,
  Tag,
} from 'lucide-react';

interface PageProps {
  searchParams?: {
    query?: string;
  };
}

export default async function MemoryPage({ searchParams }: PageProps) {
  const state = await getMemoryState();
  const query = searchParams?.query?.trim() ?? '';
  const results = query ? searchMemories(query) : [];
  const usagePercent = Math.round((state.usage.used / state.usage.total) * 100);

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Memory</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Vector Store Intelligence</h1>
          <p className="text-muted-foreground max-w-3xl">
            Orquesta colecciones semánticas, realiza búsquedas vectoriales e inyecta contexto para agentes en caliente.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <MetricPill icon={<Database className="w-4 h-4" />} label="Colecciones" value={state.collections.length} />
          <MetricPill icon={<Brain className="w-4 h-4" />} label="Fragments" value={state.fragments.length} />
          <MetricPill icon={<Gauge className="w-4 h-4" />} label="Uso" value={`${usagePercent}%`} variant="accent" />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary" />
              Uso de memoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-accent"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{state.usage.used} GB usados</span>
              <span>{state.usage.total} GB totales</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border/40 p-3">
                <p className="text-muted-foreground">Collections</p>
                <p className="text-2xl font-bold">{state.usage.collections}</p>
              </div>
              <div className="rounded-lg border border-border/40 p-3">
                <p className="text-muted-foreground">Fragments</p>
                <p className="text-2xl font-bold">{state.fragments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-4 h-4 text-secondary" />
              Search vectorial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={memorySearchAction} className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                name="query"
                placeholder="Ej: gateway restart, cliente orpheus, guardrails"
                defaultValue={query}
                className="flex-1 rounded-lg bg-background/60 border border-border/60 p-3"
                required
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold"
              >
                Consultar
              </button>
            </form>

            {query && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Resultados para “{query}” ({results.length})</p>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {results.map((fragment) => (
                    <div key={fragment.id} className="rounded-xl border border-border/40 p-4 bg-background/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{fragment.topic}</span>
                        <span className="text-xs text-muted-foreground">{(fragment.relevance * 100).toFixed(0)}% match</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{fragment.content}</p>
                      <p className="text-[11px] text-muted-foreground mt-2">{new Date(fragment.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                  {results.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border/40 p-6 text-center text-sm text-muted-foreground">
                      No encontramos fragmentos relacionados.
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-accent" />
              Inject context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={injectContextAction} className="space-y-3">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Collection</label>
                <select
                  name="collectionId"
                  className="w-full mt-1 rounded-lg bg-background/60 border border-border/60 p-3"
                  required
                >
                  {state.collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Topic</label>
                <input
                  type="text"
                  name="topic"
                  placeholder="Ej: Incident postmortem"
                  className="w-full mt-1 rounded-lg bg-background/60 border border-border/60 p-3"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Context</label>
                <textarea
                  name="content"
                  placeholder="Pega fragmentos relevantes para la colección seleccionada"
                  className="w-full rounded-lg bg-background/60 border border-border/60 p-3 min-h-32"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary/20 text-primary border border-primary/40 font-semibold py-3"
              >
                Inject now
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="w-4 h-4 text-primary" />
              Collections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <form action={createCollectionAction} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                name="name"
                placeholder="Nombre de colección"
                className="md:col-span-1 rounded-lg bg-background/60 border border-border/60 p-3"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Descripción breve"
                className="md:col-span-2 rounded-lg bg-background/60 border border-border/60 p-3"
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                className="rounded-lg bg-background/60 border border-border/60 p-3"
              />
              <button
                type="submit"
                className="md:col-span-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold py-3"
              >
                Crear colección
              </button>
            </form>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {state.collections.map((collection) => (
                <CollectionRow key={collection.id} collection={collection} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-4 h-4 text-secondary" />
              Search history
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.history.length === 0 && (
              <p className="text-sm text-muted-foreground">Aún no hay búsquedas recientes.</p>
            )}
            {state.history.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                <span className="text-sm">{entry.query}</span>
                <span className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="w-4 h-4 text-accent" />
              Últimas inserciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.fragments.slice(0, 5).map((fragment) => (
              <div key={fragment.id} className="p-3 rounded-lg border border-border/40">
                <p className="text-sm font-semibold">{fragment.topic}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{fragment.content}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{new Date(fragment.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MetricPill({ icon, label, value, variant = 'default' }: { icon: ReactNode; label: string; value: string | number; variant?: 'default' | 'accent' }) {
  const palette = {
    default: 'border-border/60 text-muted-foreground',
    accent: 'border-accent/40 text-accent',
  };

  return (
    <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full border text-sm', palette[variant])}>
      {icon}
      <span className="font-semibold text-foreground">{value}</span>
      {label}
    </div>
  );
}

function CollectionRow({ collection }: { collection: MemoryCollection }) {
  return (
    <div className="rounded-xl border border-border/40 bg-background/40 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-lg">{collection.name}</p>
          <p className="text-sm text-muted-foreground">{collection.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {collection.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-muted/40">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        </div>
        <form action={deleteCollectionAction}>
          <input type="hidden" name="collectionId" value={collection.id} />
          <button
            type="submit"
            className="p-2 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10"
            title="Eliminar colección"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </form>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-4">
        <span>Modelo: {collection.model}</span>
        <span>Vectors: {collection.vectors.toLocaleString()}</span>
        <span>Actualizado: {collection.lastUpdated}</span>
      </div>
    </div>
  );
}
