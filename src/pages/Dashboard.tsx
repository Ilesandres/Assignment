// src/pages/Dashboard.tsx

import React from "react";
import { Card, Layout } from "src/components";
import useAppStore from 'src/store/useAppStore'; // 👈 Importamos el store

const Dashboard: React.FC = () => {
  const tasks = useAppStore((s) => s.tasks || []);
  const user = useAppStore((s) => s.user);

  const total = tasks.length;
  const waiting = tasks.filter((t) => t.status === 'waiting').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const now = Date.now();
  const overdue = tasks.filter((t) => t.due && new Date(t.due).getTime() < now && t.status !== 'completed').length;
  const upcoming = tasks.filter((t) => {
    if (!t.due) return false;
    const due = new Date(t.due).getTime();
    const in7 = now + 7 * 24 * 60 * 60 * 1000;
    return due > now && due <= in7;
  }).length;

  return (
    <Layout>
      <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
        
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard — Gestión de tareas</h1>
            <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Resumen general del sistema</p>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Total de tareas</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{total}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Tareas registradas</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>En espera</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>{waiting}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Pendientes de iniciar</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>En proceso</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary-hover)' }}>{inProgress}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Actualmente activas</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Completadas</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{completedPct}%</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Porcentaje total</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Vencidas</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-error)' }}>{overdue}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Requieren atención</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Próximas</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>{upcoming}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Vencen pronto</p>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;