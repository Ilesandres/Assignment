import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Manager" },
    { name: "description", content: "Task Manager Home" },
  ];
}

export default function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return null;
}