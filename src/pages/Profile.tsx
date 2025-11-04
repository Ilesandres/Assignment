import React from "react";

import { Button, Layout } from "src/components";
import useAppStore from 'src/store/useAppStore';

const Profile: React.FC = () => {
  // Obtenemos el usuario del store. Siempre será válido gracias a <AuthGuard>.
  const user = useAppStore((s) => s.user);

  return (
    <Layout>
      <div className="flex items-start justify-center w-full min-h-screen p-8" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
        <div className="flex flex-col md:flex-row items-center w-full max-w-5xl rounded-2xl shadow-sm p-8 gap-8 transition-all duration-300" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          
          <div className="flex flex-col items-center text-center md:text-left md:items-start md:w-1/3">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 hover:scale-105 transition-transform duration-300"
                style={{ borderColor: 'var(--color-primary)' }}
              />
              <span className="absolute bottom-3 right-3 w-4 h-4 rounded-full border-2" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-surface)' }}></span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>{user?.name ?? 'Sin nombre'}</h2>
            <p className="font-medium" style={{ color: 'var(--color-primary)' }}>{user?.email ?? 'No registrado'}</p>
          </div>

          <div className="flex flex-col md:w-2/3 space-y-4">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Información del perfil</h3>
            <hr style={{ borderColor: 'var(--color-border)' }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Correo</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user?.email ?? 'marlon@example.com'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Teléfono</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>+57 300 456 7890</div>
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Ubicación</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Mocoa, Putumayo, Colombia</div>
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Miembro desde</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Enero 2023</div>
              </div>
            </div>

            <div className="mt-4">
              <Button className="px-4 py-2" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>Editar perfil</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;