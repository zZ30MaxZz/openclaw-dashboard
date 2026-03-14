'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Terminal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { moduleGroups } from '@/components/nav-config';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <div className="lg:hidden border-b border-border/50 p-4 w-full fixed top-0 z-50 bg-background/45 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              OPENCLAW
            </h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={open ? 'Cerrar navegación' : 'Abrir navegación'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="border border-border/60 hover:border-primary/50"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'lg:hidden fixed inset-0 z-40 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          className="absolute inset-0 bg-black/60"
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            'absolute inset-y-0 left-0 w-[86%] max-w-80 border-r border-border/60 bg-background/85 backdrop-blur-xl transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="p-5 border-b border-border/50">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Mission Control</p>
            <p className="text-lg font-semibold mt-1">Navegación</p>
          </div>
          <nav className="h-[calc(100%-73px)] overflow-y-auto p-4">
            {moduleGroups.map((group) => (
              <div key={group.name} className="mb-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {group.name}
                </h3>
                <ul className="space-y-1">
                  {group.modules.map((module) => {
                    const Icon = module.icon;
                    const isActive = pathname === module.path;

                    return (
                      <li key={module.id}>
                        <Link
                          href={module.path}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                            isActive
                              ? 'border border-primary/40 bg-primary/10 text-foreground'
                              : 'border border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                          )}
                        >
                          <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-secondary')} />
                          <span className="font-medium">{module.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
