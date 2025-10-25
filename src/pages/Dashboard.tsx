import React from "react";
import { Card, Layout } from "src/components";


const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gray-50">
        {/* Encabezado */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">Resumen general del sistema</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="text-sm text-gray-600">
              Bienvenido, <strong>Administrador</strong>
            </span>
          </div>
        </header>

        {/* Grid de tarjetas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Usuarios activos
            </h2>
            <p className="text-3xl font-bold text-blue-600">128</p>
            <p className="text-sm text-gray-500 mt-1">Últimas 24 horas</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Órdenes pendientes
            </h2>
            <p className="text-3xl font-bold text-yellow-500">45</p>
            <p className="text-sm text-gray-500 mt-1">Esperando aprobación</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Ventas totales
            </h2>
            <p className="text-3xl font-bold text-green-600">$3.200.000</p>
            <p className="text-sm text-gray-500 mt-1">Actualizado hoy</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Nuevos clientes
            </h2>
            <p className="text-3xl font-bold text-purple-600">32</p>
            <p className="text-sm text-gray-500 mt-1">Esta semana</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Tareas completadas
            </h2>
            <p className="text-3xl font-bold text-indigo-600">67%</p>
            <p className="text-sm text-gray-500 mt-1">Progreso general</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Mensajes no leídos
            </h2>
            <p className="text-3xl font-bold text-red-500">14</p>
            <p className="text-sm text-gray-500 mt-1">Desde ayer</p>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
