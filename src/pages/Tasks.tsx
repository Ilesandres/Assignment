import React, { useState } from 'react';
import { Card, Button, Navbar, Input } from '../components';
import type { Task as TaskType, TaskStatus } from 'src/shared';
import { statusColumnBg, statusPillClass } from 'src/shared/ui';
import { groupByStatus } from 'src/services/taskService';
import useAppStore from 'src/store/useAppStore';
import AddTaskModal from 'src/components/AddTaskModal';


const statusLabels: Record<TaskStatus, string> = {
  'waiting': 'En espera',
  'in-progress': 'En proceso',
  'completed': 'Completado',
  'abandoned': 'Abandonado',
};

const formatDueDate = (dueString?: string) => {
  if (!dueString) return 'Sin fecha';
  try {
    const date = new Date(dueString);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch (e) {
    return dueString;
  }
};

export default function Tasks() {
  const tasks = useAppStore((s) => s.tasks);
  const updateStatusAction = useAppStore((s) => s.updateTaskStatus);
  const deleteTaskAction = useAppStore((s) => s.deleteTask);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');

  function updateStatus(id: string, status: TaskStatus) {
    updateStatusAction(id, status);
  }

  function deleteTask(id: string) {
    deleteTaskAction(id);
  }

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const grouped = groupByStatus(filteredTasks);

  const totalTasks = tasks.length;
  const filteredCount = filteredTasks.length;
  let subtitle = "";

  if (searchTerm) {
    subtitle = filteredCount === 0 
        ? `No se encontraron tareas para "${searchTerm}"`
        : `Mostrando ${filteredCount} de ${totalTasks} tareas`;
  } else {
    subtitle = totalTasks === 0 
        ? "No hay tareas. ¡Agrega una!" 
        : totalTasks === 1
        ? "Mostrando 1 tarea"
        : `Mostrando ${totalTasks} tareas`;
  }

  return (
    <div className="min-h-screen var(--color-background)">
      <Navbar showHomeButton={true} />

      <div className="p-4 max-w-7xl mx-auto">
        
        <header className="mb-6">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold flex-shrink-0">Tareas</h1>
              
              <div className="w-64 ml-8"> 
                <Input 
                  id="search-tasks"
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={() => setIsModalOpen(true)} className="px-4 py-2 flex-shrink-0">
              <span className="mr-2">+</span>
              Agregar tarea
            </Button>
          </div>
          
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
            {subtitle}
          </p>
        </header>


        <div className="overflow-x-auto">
          <div className="min-w-[900px] grid grid-cols-4 gap-4 items-start">
                {(['waiting', 'in-progress', 'completed', 'abandoned'] as TaskStatus[]).map((status) => {
                          return (
                            <section key={status} className={`${statusColumnBg[status]} p-5 rounded-md`}>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="font-medium text-gray-700">{statusLabels[status]}</div>
                        <div className={`text-xs font-medium px-2 py-1 rounded ${statusPillClass[status]}`}>{grouped[status].length}</div>
                      </div>

                      <div className="space-y-3">
                        {grouped[status].length === 0 && (
                          <div className="text-xs text-gray-400">
                            {searchTerm ? 'Ninguna tarea coincide' : 'No hay tareas'}
                          </div>
                        )}

                        {grouped[status].map((task) => {
                          const now = Date.now();
                          const isOverdue = task.due && new Date(task.due).getTime() < now && task.status !== 'completed';

                          return (
                            <Card 
                              key={task.id} 
                              className={`relative transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${task.status === 'completed' ? 'opacity-60' : ''} ${isOverdue ? 'border-2 border-red-500' : ''}`} 
                              title={task.title}
                            >
                              <div className="flex justify-end mb-2">
                                <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100"
                                style={{ color: 'var(--color-text-muted)' }}
                                aria-label={`Eliminar ${task.title}`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                              </button>
                              </div>
                              
                              {task.description && (
                                <p className="text-sm mb-3 var(--color-text) truncate" style={{ color: 'var(--color-text-muted)'}}>
                                  {task.description}
                                </p>
                              )}
                              
                              <div 
                                className={`text-xs mb-4 ${isOverdue ? 'font-bold' : 'var(--color-text)'}`}
                                style={isOverdue ? { color: 'var(--color-error)' } : {}}
                              >
                                {formatDueDate(task.due)}
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <div className={`text-sm ${task.status === 'completed' ? 'line-through var(--color-text)' : 'var(--color-text)'}`}>
                                  {statusLabels[task.status]}
                                </div>

                                <select
                                  value={task.status}
                                  onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs px-3 py-2 rounded-md border"
                                  style={{ 
                                    backgroundColor: 'var(--color-surface)', 
                                    color: 'var(--color-text)', 
                                    borderColor: 'var(--color-border)' 
                                  }}
                                >
                                  <option value="waiting">En espera</option>
                                  <option value="in-progress">En proceso</option>
                                  <option value="completed">Completado</option>
                                  <option value="abandoned">Abandonado</option>
                                </select>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
          </div>
        </div>
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}