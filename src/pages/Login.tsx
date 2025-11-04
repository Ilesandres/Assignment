import React, { useState } from 'react';
import { Input, Button } from '../components';
import { auth } from 'src/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setIsSubmitting(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/task', { replace: true }); 
        } catch (error: any) {
            console.error('Login error:', error);
            let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = 'Correo o contraseña incorrectos.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'El formato del correo electrónico es inválido.';
            }
            setLoginError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(to bottom right, var(--color-background), var(--color-surface))' }}
        >
            <div className="w-full max-w-md">
                <div
                    className="shadow-lg rounded-xl p-8"
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'var(--color-border)'
                    }}
                >

                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform rotate-3">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                        <h1
                            className="text-2xl font-bold mb-1"
                            style={{ color: 'var(--color-text)' }}
                        >
                            Iniciar sesión
                        </h1>
                        <p
                            className="text-sm"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Ingresa tus credenciales para continuar
                        </p>
                    </div>

                    {loginError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{loginError}</span>
                        </div>
                    )}


                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            id="email"
                            label="Correo electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            required
                            icon={
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    <path d="M2.94 6.94A2 2 0 014 6h12a2 2 0 011.06.94L10 11 2.94 6.94z" />
                                    <path d="M18 8.73V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.73l8 4.5 8-4.5z" />
                                </svg>
                            }
                        />

                        <Input
                            id="password"
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            icon={
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded focus:ring-2"
                                    style={{
                                        accentColor: 'var(--color-primary)',
                                        borderColor: 'var(--color-border)'
                                    }}
                                />
                                <span
                                    className="ml-2"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    Recordarme
                                </span>
                            </label>
                            <a
                                href="#"
                                className="font-medium hover:underline"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={!email || !password || isSubmitting}
                        >
                            {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p
                            className="text-sm"
                            style={{ color: 'var(--color-text)' }}
                        >
                            ¿No tienes cuenta?{' '}
                            <a
                                href="/register"
                                className="font-semibold hover:underline"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                Regístrate
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}