import React, { useState } from 'react';
import { Card, Button, Navbar, Input } from '../components';
import type { Task as TaskType, TaskStatus } from 'src/shared';
import { statusColumnBg, statusPillClass } from 'src/shared/ui';
import { groupByStatus } from 'src/services/taskService';
import useAppStore from 'src/store/useAppStore';

const statusLabels: Record<TaskStatus, string> = {
  'waiting': 'En espera',
  'in-progress': 'En proceso',
  'completed': 'Completado',
  'abandoned': 'Abandonado',
};

export default function Tasks() {
  const tasks = useAppStore((s) => s.tasks);
  const addTaskAction = useAppStore((s) => s.addTask);
  const updateStatusAction = useAppStore((s) => s.updateTaskStatus);
  const deleteTaskAction = useAppStore((s) => s.deleteTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusSel, setStatusSel] = useState<TaskStatus>('waiting');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showForm, setShowForm] = useState(true);

  function updateStatus(id: string, status: TaskStatus) {
    updateStatusAction(id, status);
  }

  function addTask(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const due = date ? (time ? `${date} ${time}` : date) : undefined;
    const newTask: TaskType = {
      id: `t${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      due: due,
      status: statusSel,
    };

  addTaskAction(newTask);
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setStatusSel('waiting');
  }

  function deleteTask(id: string) {
    deleteTaskAction(id);
  }

  const grouped = groupByStatus(tasks);

  return (
    <div className="min-h-screen var(--color-background)">
      <Navbar />

      <div className="p-4 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Tareas</h1>
          <p className="text-sm var(--color-text)">Tablero simple (simulado).</p>
        </header>

        {/* Header + toggle for the form */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Agregar tarea</h2>
            <p className="text-xs var(--color-text)">Crea una nueva tarea y asígnala a una columna.</p>
          </div>
          <div>
            <button
              type="button"
              aria-expanded={showForm}
              onClick={() => setShowForm((s) => !s)}
              className="p-2 rounded-md hover:text-[var(--color-text-muted)] cursor-pointer"
              title={showForm ? 'Ocultar formulario' : 'Mostrar formulario'}
            >
              {showForm ? (
                // Up arrow (collapse)
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M5 3h14"></path>
                  <path d="m18 13-6-6-6 6"></path>
                  <path d="M12 7v14"></path>
                </svg>
              ) : (
                // Down arrow (expand)
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 17V3"></path>
                  <path d="m6 11 6 6 6-6"></path>
                  <path d="M19 21H5"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Form to add a new task (collapsible) */}
        {showForm && (
          <form onSubmit={addTask} className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-3 items-end">
          <div className="lg:col-span-2">
            <Input id="new-title" label="Título" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nueva tarea" />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium var(--color-text)">Estado</label>
            <select id="status" value={statusSel} onChange={(e) => setStatusSel(e.target.value as TaskStatus)} className="block w-full px-3 py-2 border rounded-md"
                style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>

              <option value="waiting">En espera</option>
              <option value="in-progress">En proceso</option>
              <option value="completed">Completado</option>
              <option value="abandoned">Abandonado</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label htmlFor="date" className="block text-sm font-medium var(--color-text) mb-1">Fecha</label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="w-1/2">
              <label htmlFor="time" className="block text-sm font-medium var(--color-text) mb-1">Hora</label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="lg:col-span-4">
            <Input id="desc" label="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalles" />
          </div>

          <div className="lg:col-span-4 flex gap-2">
            <Button type="submit" className="px-4 py-2">Agregar tarea</Button>
            <Button type="button" variant="secondary" onClick={() => { setTitle(''); setDescription(''); setDate(''); setTime(''); setStatusSel('waiting'); }} className="px-4 py-2">Limpiar</Button>
          </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-[900px] grid grid-cols-4 gap-4">
                {(['waiting', 'in-progress', 'completed', 'abandoned'] as TaskStatus[]).map((status) => {
                          return (
                            <section key={status} className={`${statusColumnBg[status]} p-5 rounded-md`}>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="font-medium text-gray-700">{statusLabels[status]}</div>
                        <div className={`text-xs font-medium px-2 py-1 rounded ${statusPillClass[status]}`}>{grouped[status].length}</div>
                      </div>

                      <div className="space-y-3">
                        {grouped[status].length === 0 && (
                          <div className="text-xs text-gray-400">No hay tareas</div>
                        )}

                        {grouped[status].map((task) => (
                          <Card key={task.id} className={`${task.status === 'completed' ? 'opacity-60' : ''}`} title={task.title}>
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
                            <div className="text-sm mb-3">{task.description}</div>
                            <div className="text-xs var(--color-text) mb-4">{task.due}</div>

                            <div className="flex items-center justify-between gap-2">
                              <div className={`text-sm ${task.status === 'completed' ? 'line-through var(--color-text)' : 'var(--color-text)'}`}>
                                {statusLabels[task.status]}
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                {/* Buttons to move between states (simple) */}
                                {task.status !== 'waiting' && (
                                  <Button variant="secondary" className="text-xs px-3 py-2 rounded-md" onClick={() => updateStatus(task.id, 'waiting')}>
                                    Espera
                                  </Button>
                                )}

                                {task.status !== 'in-progress' && (
                                  <Button variant="primary" className="text-xs px-3 py-2 rounded-md" onClick={() => updateStatus(task.id, 'in-progress')}>
                                    En proceso
                                  </Button>
                                )}

                                {task.status !== 'completed' && (
                                  <Button variant="primary" className="text-xs px-3 py-2 rounded-md" onClick={() => updateStatus(task.id, 'completed')}>
                                    Completar
                                  </Button>
                                )}

                                {task.status !== 'abandoned' && (
                                  <Button variant="secondary" className="text-xs px-3 py-2 rounded-md" onClick={() => updateStatus(task.id, 'abandoned')}>
                                    Abandonar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </section>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
