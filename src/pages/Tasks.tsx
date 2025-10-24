import React, { useState } from 'react';
import { Card, Button, Navbar } from '../components';
import type { Task as TaskType, TaskStatus } from 'src/shared';
import { initialTasks } from 'src/shared/data';
import { statusColumnBg, statusPillClass } from 'src/shared/ui';

const statusLabels: Record<TaskStatus, string> = {
  'waiting': 'En espera',
  'in-progress': 'En proceso',
  'completed': 'Completado',
  'abandoned': 'Abandonado',
};

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);

  function updateStatus(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  const grouped: Record<TaskStatus, TaskType[]> = {
    'waiting': [],
    'in-progress': [],
    'completed': [],
    'abandoned': [],
  };

  tasks.forEach((t) => grouped[t.status].push(t));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-4 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Tareas</h1>
          <p className="text-sm text-gray-600">Tablero simple con 4 columnas y estado local (simulado).</p>
        </header>

        <div className="overflow-x-auto">
          <div className="min-w-[900px] grid grid-cols-4 gap-4">
                {(['waiting', 'in-progress', 'completed', 'abandoned'] as TaskStatus[]).map((status) => {
                  return (
                    <section key={status} className={`${statusColumnBg[status]} p-3 rounded-md`}>
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
                            <div className="text-sm  mb-2">{task.description}</div>
                            <div className="text-xs text-gray-500 mb-3">{task.due}</div>

                            <div className="flex items-center justify-between gap-2">
                              <div className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                {statusLabels[task.status]}
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* Buttons to move between states (simple) */}
                                {task.status !== 'waiting' && (
                                  <Button variant="secondary" className="text-xs px-3 py-1 rounded-md" onClick={() => updateStatus(task.id, 'waiting')}>
                                    Espera
                                  </Button>
                                )}

                                {task.status !== 'in-progress' && (
                                  <Button variant="primary" className="text-xs px-3 py-1 rounded-md" onClick={() => updateStatus(task.id, 'in-progress')}>
                                    En proceso
                                  </Button>
                                )}

                                {task.status !== 'completed' && (
                                  <Button variant="primary" className="text-xs px-3 py-1 rounded-md" onClick={() => updateStatus(task.id, 'completed')}>
                                    Completar
                                  </Button>
                                )}

                                {task.status !== 'abandoned' && (
                                  <Button variant="secondary" className="text-xs px-3 py-1 rounded-md" onClick={() => updateStatus(task.id, 'abandoned')}>
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
