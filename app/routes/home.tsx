import type { Route } from "./+types/home";
import HomeScreen from "src/pages/Home";
import AuthGuard from "src/components/AuthGuard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Manager - Inicio" },
    { name: "description", content: "Página principal del usuario." },
  ];
}

export default function HomeRoute() {
  return (
    <AuthGuard>
      <HomeScreen />
    </AuthGuard>
  );
}