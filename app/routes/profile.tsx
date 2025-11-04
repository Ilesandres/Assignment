import Profile from "../../src/pages/Profile";
import AuthGuard from "src/components/AuthGuard";

export default function ProfileRoute() {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  );
}