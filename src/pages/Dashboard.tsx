import React from "react";
import { Card, Layout } from "src/components";
import useAppStore from 'src/store/useAppStore';


const Dashboard: React.FC = () => {
  const total = 231;
  const waiting = 34;
  const inProgress = 89;
  const completedPct = 67;
  const overdue = 12;
  const upcoming = 27;
  const user = useAppStore((s) => s.user);

  return (
    <Layout>
      <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
        
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard — Gestión de tareas</h1>
            <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Resumen general del sistema</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="text-sm" style={{ color: 'var(--color-text)' }}>
              Bienvenido, <strong>{user?.name ?? 'Administrador'}</strong>
            </span>
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