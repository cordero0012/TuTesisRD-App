import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Clock } from 'lucide-react';
import { AdminProject } from '@/services/admin/adminDataService';

interface KanbanColumn {
  id: string;
  title: string;
  projects: AdminProject[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onDragEnd: (result: any) => void;
  onProjectClick: (id: string) => void;
}

const getStatusColor = (status: string) => {
    switch(status) {
        case 'pending': return 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-400';
        case 'assigned': return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400';
        case 'in_progress': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400';
        case 'review': return 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400';
        case 'completed': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400';
        default: return 'bg-accent border-border';
    }
};

const getStatusBarColor = (status: string) => {
    switch(status) {
        case 'completed': return 'bg-emerald-500';
        case 'review': return 'bg-amber-500';
        case 'pending': return 'bg-slate-500';
        default: return 'bg-primary';
    }
};

export function KanbanBoard({ columns, onDragEnd, onProjectClick }: KanbanBoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 h-[calc(100vh-220px)] w-full overflow-x-auto pb-4 scrollbar-thin">
        {columns.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-[320px] flex flex-col bg-card/40 backdrop-blur-md rounded-2xl border border-border/50">
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <h3 className="font-bold text-sm tracking-tight">{col.title}</h3>
              <span className="text-xs font-semibold bg-accent/60 px-2 py-0.5 rounded-full text-muted-foreground">
                {col.projects.length}
              </span>
            </div>
            
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${
                    snapshot.isDraggingOver ? 'bg-accent/20' : ''
                  }`}
                >
                  {col.projects.map((project, index) => {
                      const clientName = project.students
                        ? `${project.students.name} ${project.students.lastname}`
                        : "Sin cliente";

                      return (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}
                              className={`group relative bg-card rounded-xl border border-border/50 p-4 transition-all hover:shadow-lg hover:border-primary/30 cursor-grab active:cursor-grabbing ${
                                snapshot.isDragging ? 'shadow-2xl rotate-2 ring-2 ring-primary scale-105 z-50' : 'shadow-sm'
                              }`}
                              onClick={() => onProjectClick(project.id)}
                            >
                              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${getStatusBarColor(col.id)}`} />
                              
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                                        {project.tracking_code}
                                    </span>
                                    <h4 className="font-bold text-sm leading-snug line-clamp-2">
                                        {project.title || 'Proyecto sin título'}
                                    </h4>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-accent text-muted-foreground transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold">
                                    {clientName.charAt(0)}
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground truncate">
                                    {clientName}
                                </span>
                              </div>

                              <div className="space-y-1.5 mb-3">
                                  <div className="flex justify-between text-[10px] font-bold">
                                      <span className="text-muted-foreground">PROGRESO</span>
                                      <span className={project.progress_percent === 100 ? 'text-emerald-500' : 'text-primary'}>
                                        {project.progress_percent}%
                                      </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-accent/50 rounded-full overflow-hidden">
                                      <div
                                          className={`h-full rounded-full transition-all ${
                                              project.progress_percent === 100 ? 'bg-emerald-500' : 'bg-primary'
                                          }`}
                                          style={{ width: `${project.progress_percent}%` }}
                                      />
                                  </div>
                              </div>

                              {project.due_date && (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground border-t border-border/50 pt-2">
                                    <Clock className="h-3 w-3" />
                                    <span>{new Date(project.due_date).toLocaleDateString('es-DO', {day: 'numeric', month: 'short'})}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
