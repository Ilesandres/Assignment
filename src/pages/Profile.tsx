import React, { useState, useEffect } from "react";

import { Button, Layout, Input } from "src/components";
import useAppStore from 'src/store/useAppStore';
import { getProfileApi, updateProfileApi, createProfileApi } from 'src/services/apiProfileService';
import type { UserProfile } from 'src/shared';

const Profile: React.FC = () => {
  // Obtenemos el usuario del store. Siempre será válido gracias a <AuthGuard>.
  const user = useAppStore((s) => s.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);
  
  // Estados para el formulario de edición
  const [editForm, setEditForm] = useState({
    displayName: '',
    phone: '',
    location: '',
  });

  // Obtener perfil del backend API al montar
  useEffect(() => {
    if (!user?.uid) return;
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const p = await getProfileApi(user.uid);
        if (!mounted) return;
        setProfile(p);
        if (p) {
          setEditForm({
            displayName: p.displayName || '',
            phone: p.phone || '',
            location: p.location || '',
          });
        }
      } catch (e) {
        console.error('Error fetching profile from API:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [user?.uid]);

  const handleCreateProfile = async () => {
    if (!user?.uid || !user?.email) return;
    
    setCreatingProfile(true);
    try {
      await createProfileApi({ email: user.email, displayName: user.name || undefined });
      console.log('✅ Perfil creado exitosamente');
      // Re-fetch profile
      const p = await getProfileApi(user.uid);
      setProfile(p);
    } catch (error) {
      console.error('Error creating profile via API:', error);
      alert('Error al crear el perfil. Por favor intenta de nuevo.');
    } finally {
      setCreatingProfile(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        location: profile.location || '',
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    
    setSaving(true);
    try {
      const updated = await updateProfileApi(user.uid, {
        displayName: editForm.displayName || null,
        phone: editForm.phone || null,
        location: editForm.location || null,
      });
      setProfile(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile via API:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const formatMemberSince = (dateString: string | undefined) => {
    if (!dateString) return 'Fecha desconocida';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    } catch {
      return 'Fecha desconocida';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center w-full min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
            <p style={{ color: 'var(--color-text-muted)' }}>Cargando perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex items-center justify-center w-full min-h-screen p-8" style={{ backgroundColor: 'var(--color-background)' }}>
          <div className="text-center max-w-md p-8 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Perfil no encontrado
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Parece que eres un usuario registrado antes de la actualización. 
                Crea tu perfil ahora para acceder a todas las funcionalidades.
              </p>
            </div>
            <Button 
              onClick={handleCreateProfile}
              disabled={creatingProfile}
              className="px-6 py-2 w-full" 
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              {creatingProfile ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando perfil...
                </span>
              ) : (
                'Crear mi perfil'
              )}
            </Button>
            <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
              Esto solo se hace una vez y es completamente automático
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-start justify-center w-full min-h-screen p-8" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
        <div className="flex flex-col md:flex-row items-center w-full max-w-5xl rounded-2xl shadow-sm p-8 gap-8 transition-all duration-300" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          
          <div className="flex flex-col items-center text-center md:text-left md:items-start md:w-1/3">
            <div className="relative">
              <img
                src={profile.photoURL}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 hover:scale-105 transition-transform duration-300"
                style={{ borderColor: 'var(--color-primary)' }}
              />
              <span className="absolute bottom-3 right-3 w-4 h-4 rounded-full border-2" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-surface)' }}></span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>{profile.displayName || 'Sin nombre'}</h2>
            <p className="font-medium" style={{ color: 'var(--color-primary)' }}>{profile.email}</p>
          </div>

          <div className="flex flex-col md:w-2/3 space-y-4">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Información del perfil</h3>
            <hr style={{ borderColor: 'var(--color-border)' }} />
            
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Nombre completo"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  placeholder="Tu nombre completo"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Teléfono"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+57 300 456 7890"
                  />
                  <Input
                    label="Ubicación"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Ciudad, País"
                  />
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="px-4 py-2" 
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-4 py-2" 
                    style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Correo</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{profile.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Teléfono</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{profile.phone || 'No especificado'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Ubicación</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{profile.location || 'No especificada'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Miembro desde</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{formatMemberSince(profile.memberSince)}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button onClick={handleEdit} className="px-4 py-2" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>Editar perfil</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;