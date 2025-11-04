import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Route } from "./+types/home";
// El componente 'Welcome' de la plantilla base ha sido removido.

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Redirigiendo a Login" },
    { name: "description", content: "Redirigiendo a la pantalla de inicio de sesión." },
  ];
}

export default function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige inmediatamente a la ruta de Login (/login)
    // 'replace: true' evita que la página raíz quede en el historial de navegación.
    navigate('/login', { replace: true });
  }, [navigate]);

  // No renderiza nada mientras se completa la redirección
  return null;
}