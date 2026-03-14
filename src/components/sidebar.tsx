import React from 'react';
import Link from 'next/link';
import { Terminal } from 'lucide-react';
import { moduleGroups } from '@/components/nav-config';

export function Sidebar() {
  return (
    <div className="glass-panel h-screen w-64 border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
            <Terminal className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              OPENCLAW
            </h1>
            <p className="text-xs text-muted-foreground">Mission Control v2.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {moduleGroups.map((group) => (
          <div key={group.name} className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {group.name}
            </h3>
            <ul className="space-y-1">
              {group.modules.map((module) => {
                const Icon = module.icon;
                return (
                  <li key={module.id}>
                    <Link
                      href={module.path}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-muted/50 hover:glow-primary group"
                    >
                      <Icon className="w-4 h-4 text-primary group-hover:text-accent transition-colors" />
                      <span className="font-medium">{module.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Status footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-muted-foreground">System Online</span>
          </div>
          <div className="text-xs text-muted-foreground">v2.6.0</div>
        </div>
      </div>
    </div>
  );
}
