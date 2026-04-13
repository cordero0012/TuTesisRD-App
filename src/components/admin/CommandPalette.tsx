import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { FolderKanban, UserCheck, Search, FileText, X } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setOpen(false)}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 mx-4">
        <Command 
            className="flex h-full w-full flex-col overflow-hidden bg-transparent"
            onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
            }}
        >
          <div className="flex items-center border-b border-border/50 px-4">
            <Search className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Command.Input 
                autoFocus
                placeholder="Busca proyectos, clientes, o acciones... (Esc para salir)" 
                className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-foreground"
            />
            <button onClick={() => setOpen(false)} className="rounded-md p-1 border border-border ml-2 text-xs font-semibold hover:bg-accent/50 text-muted-foreground transition-colors">
              ESC
            </button>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollbar-none">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Acciones Rápidas" className="px-2 text-xs font-medium text-muted-foreground py-2">
              <Command.Item 
                onSelect={() => { navigate('/admin/proyectos'); setOpen(false); }}
                className="flex cursor-pointer items-center space-x-2 rounded-xl px-2 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors data-[selected]:bg-primary/20 data-[selected]:text-primary outline-none"
              >
                <FolderKanban className="h-4 w-4" />
                <span>Ir a Proyectos</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => { navigate('/admin/clientes'); setOpen(false); }}
                className="flex cursor-pointer items-center space-x-2 rounded-xl px-2 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors data-[selected]:bg-primary/20 data-[selected]:text-primary outline-none"
              >
                <UserCheck className="h-4 w-4" />
                <span>Ir a Clientes</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => { setOpen(false); alert("Abrir modal de reporte"); }}
                className="flex cursor-pointer items-center space-x-2 rounded-xl px-2 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors data-[selected]:bg-primary/20 data-[selected]:text-primary outline-none"
              >
                <FileText className="h-4 w-4" />
                <span>Generar Reporte Excel</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Navegación del Sistema" className="px-2 text-xs font-medium text-muted-foreground py-2 border-t border-border/40">
              <Command.Item 
                onSelect={() => { navigate('/admin/settings'); setOpen(false); }}
                className="flex cursor-pointer items-center space-x-2 rounded-xl px-2 py-3 text-sm hover:bg-accent hover:text-foreground transition-colors data-[selected]:bg-accent data-[selected]:text-foreground outline-none"
              >
                <span>Ajustes</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => { navigate('/admin'); setOpen(false); }}
                className="flex cursor-pointer items-center space-x-2 rounded-xl px-2 py-3 text-sm hover:bg-accent hover:text-foreground transition-colors data-[selected]:bg-accent data-[selected]:text-foreground outline-none"
              >
                <span>Dashboard Principal</span>
              </Command.Item>
            </Command.Group>

          </Command.List>
        </Command>
      </div>
    </div>
  );
}
