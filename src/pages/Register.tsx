import React, { useState } from 'react';
import { Input, Button } from '../components';
import { useNavigate } from 'react-router-dom';
import { registerUser } from 'src/services/authService';
import useAppStore from 'src/store/useAppStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await registerUser(email.trim(), password, name.trim() || undefined);
      setUser(user as any);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message ?? 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, var(--color-background), var(--color-surface))' }}>
      <div className="w-full max-w-md">
        <div className="shadow-lg rounded-xl p-8" style={{ backgroundColor: 'var(--color-surface)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Crear cuenta</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Regístrate con correo y contraseña</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="name" label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
            <Input id="email" label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
            <Input id="password" label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

            <Button type="submit" variant="primary" className="w-full" disabled={!email || !password || loading}>{loading ? 'Creando...' : 'Crear cuenta'}</Button>
          </form>

          {error && <div className="mt-4 text-sm text-red-600" role="alert">{error}</div>}

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-text)' }}>¿Ya tienes cuenta? <a href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Inicia sesión</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
