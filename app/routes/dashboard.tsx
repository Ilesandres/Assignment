import Dashboard from "../../src/pages/Dashboard";
import AuthGuard from "src/components/AuthGuard";

export default function DashboardRoute() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}