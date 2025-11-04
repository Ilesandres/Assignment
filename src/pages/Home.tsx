import React from "react";
import { Layout, Card } from "src/components";
import useAppStore from "src/store/useAppStore";

const HomeScreen: React.FC = () => {
    const user = useAppStore(s => s.user);

    return (
        <Layout>
            <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
                
                {/* Cabecera de Bienvenida */}
                <header className="mb-10 p-6 rounded-xl shadow-md" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <h1 className="text-4xl font-extrabold" style={{ color: 'var(--color-primary)' }}>
                        ¡Bienvenido, {user?.name ?? 'Marlon'}!
                    </h1>
                    <p className="mt-3 text-lg" style={{ color: 'var(--color-text-muted)' }}>
                        Estás en el Task Manager, tu herramienta personal para organizar tareas y proyectos.
                    </p>
                </header>

                <section className="space-y-8">
                    
                    <Card>
                        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                            ¿Qué puedes hacer en la aplicación?
                        </h2>
                        <ul className="list-disc list-inside space-y-3 pl-4" style={{ color: 'var(--color-text-muted)' }}>
                            <li>
                                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Tareas (Task):</span> Gestiona tu flujo de trabajo con el tablero Kanban. Puedes crear, actualizar el estado (En espera, En proceso, Completado, Abandonado) y eliminar tus tareas.
                            </li>
                            <li>
                                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Dashboard:</span> Revisa un resumen detallado de las métricas clave de tu productividad, como el porcentaje de tareas completadas y las tareas vencidas.
                            </li>
                            <li>
                                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Perfil (Profile):</span> Visualiza y actualiza la información de tu cuenta.
                            </li>
                            <li>
                                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Seguridad de Datos:</span> Todos tus datos (tareas) están vinculados de forma segura a tu cuenta en Firebase Firestore, garantizando que solo tú tienes acceso a tu información.
                            </li>
                        </ul>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                            Cómo Empezar
                        </h2>
                        <p className="space-y-2" style={{ color: 'var(--color-text-muted)' }}>
                            1. Navega a **Tareas** en el menú lateral para crear tu primera tarea.
                            <br />
                            2. Usa **Dashboard** para hacer seguimiento a tu progreso general.
                        </p>
                    </Card>

                </section>
                
                <footer className="mt-12 p-4 text-center rounded-lg" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                    Tu productividad comienza aquí. ¡Organiza tu día!
                </footer>
            </div>
        </Layout>
    );
};

export default HomeScreen;