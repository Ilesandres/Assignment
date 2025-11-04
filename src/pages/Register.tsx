import React, { useState } from 'react';
import { Input, Button } from '../components';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError(null);

        // Validaciones
        if (password !== confirmPassword) {
            setRegisterError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setRegisterError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setIsSubmitting(true);

        try {
            await registerUser(email, password, displayName);
            // Redirigir al inicio después del registro exitoso
            navigate('/', { replace: true });
        } catch (error: any) {
            console.error('Register error:', error);
            let errorMessage = 'Error al registrar. Intenta nuevamente.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este correo ya está registrado.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'El formato del correo electrónico es inválido.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'La contraseña es muy débil.';
            }
            setRegisterError(errorMessage);
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

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform rotate-3">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                        </div>
                        <h1
                            className="text-2xl font-bold mb-1"
                            style={{ color: 'var(--color-text)' }}
                        >
                            Crear cuenta
                        </h1>
                        <p
                            className="text-sm"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Regístrate para comenzar
                        </p>
                    </div>

                    {registerError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{registerError}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            id="displayName"
                            label="Nombre completo"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Tu nombre"
                            icon={
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        />

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

                        <Input
                            id="confirmPassword"
                            label="Confirmar contraseña"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={!email || !password || !confirmPassword || isSubmitting}
                        >
                            {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p
                            className="text-sm"
                            style={{ color: 'var(--color-text)' }}
                        >
                            ¿Ya tienes cuenta?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-semibold hover:underline bg-transparent border-none cursor-pointer"
                                style={{ color: 'var(--color-primary)' }}
                                type="button"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}