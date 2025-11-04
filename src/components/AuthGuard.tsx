import React from 'react';
import { Navigate } from 'react-router-dom';
import useAppStore from 'src/store/useAppStore';

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const user = useAppStore((s) => s.user);
  const authChecked = useAppStore((s) => s.authChecked);

  if (!authChecked) {
    return <div className="h-screen flex items-center justify-center">Cargando...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}