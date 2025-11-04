import Tasks from "src/pages/Tasks";
import AuthGuard from "src/components/AuthGuard";

export default function Task() {
    return (
        <AuthGuard>
            <Tasks />
        </AuthGuard>
    );
}