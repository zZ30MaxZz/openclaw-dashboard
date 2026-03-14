import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDocuments, getDocumentCounts } from '@/lib/docs-store';
import { createDocumentAction, deleteDocumentAction, searchDocumentsAction } from './actions';
import { FileText, Search, BookOpen, Code, GraduationCap, HelpCircle, Plus, Trash2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryConfig = {
  guide: { color: 'text-cyan-400', bg: 'bg-cyan-400/10', icon: <BookOpen className="w-4 h-4" />, label: 'Guide' },
  api: { color: 'text-purple-400', bg: 'bg-purple-400/10', icon: <Code className="w-4 h-4" />, label: 'API' },
  tutorial: { color: 'text-green-400', bg: 'bg-green-400/10', icon: <GraduationCap className="w-4 h-4" />, label: 'Tutorial' },
  reference: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: <FileText className="w-4 h-4" />, label: 'Reference' },
  faq: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: <HelpCircle className="w-4 h-4" />, label: 'FAQ' },
};

type DocsPageProps = {
  searchParams?: Promise<{
    query?: string;
  }>;
};

export default async function DocsPage({ searchParams }: DocsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query?.trim().toLowerCase() || '';
  const allDocs = await getDocuments();
  const docs = query
    ? allDocs.filter((doc) =>
        [doc.title, doc.description, doc.content, doc.author, ...doc.tags]
          .join(' ')
          .toLowerCase()
          .includes(query),
      )
    : allDocs;
  const categoryCounts = await getDocumentCounts();
  const totalDocs = allDocs.length;

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Docs</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground max-w-2xl">
            Documentation, guides, and references for the OpenClaw AI orchestration platform.
          </p>
        </div>
        <Card className="glass-panel border border-border/60 w-full lg:w-auto">
          <CardContent className="p-5 flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Total documents</span>
            <span className="text-3xl font-bold text-primary">{totalDocs}</span>
          </CardContent>
        </Card>
      </header>

      {/* Category Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categoryCounts.map(({ category, count }) => {
          const config = categoryConfig[category];
          return (
            <Card key={category} className="glass-panel border border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{config.label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <div className={cn("p-3 rounded-full", config.bg)}>
                    <div className={config.color}>{config.icon}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Create */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={searchDocumentsAction} className="space-y-4">
              <input
                type="text"
                name="query"
                placeholder="Search by title, description, or tags..."
                defaultValue={resolvedSearchParams?.query ?? ''}
                className="w-full p-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="w-full p-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Search Documents
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Create New Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createDocumentAction} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Document title"
                className="w-full p-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Brief description"
                className="w-full p-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="w-full p-3 rounded-lg bg-gradient-to-r from-secondary to-accent text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Create Document
              </button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card className="glass-panel border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {query ? `Search Results (${docs.length})` : `All Documents (${totalDocs})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {docs.map((doc) => {
              const config = categoryConfig[doc.category];
              return (
                <div key={doc.id} className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium", config.bg, config.color)}>
                          {config.icon}
                          {config.label}
                        </span>
                        <span className="text-sm text-muted-foreground">By {doc.author}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{doc.title}</h3>
                      <p className="text-muted-foreground mb-3">{doc.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {doc.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground">Last updated: {doc.lastUpdated}</span>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-border hover:bg-blue-500/10 hover:text-blue-400 transition-colors">
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <form action={deleteDocumentAction}>
                          <input type="hidden" name="id" value={doc.id} />
                          <button
                            type="submit"
                            className="p-2 rounded-lg border border-border hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-panel border border-border/50">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">API Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4">Complete REST API reference for developers</p>
            <button className="text-primary hover:underline">View API Docs →</button>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Agent Guides</h3>
            <p className="text-sm text-muted-foreground mb-4">Learn how to configure and manage AI agents</p>
            <button className="text-primary hover:underline">View Agent Guides →</button>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Tutorials</h3>
            <p className="text-sm text-muted-foreground mb-4">Step-by-step tutorials for common workflows</p>
            <button className="text-primary hover:underline">View Tutorials →</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
