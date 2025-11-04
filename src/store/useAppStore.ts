import { create } from 'zustand';
import type { Task as TaskType, TaskStatus } from 'src/shared';
import { loadTasks, saveTasks, addTask as svcAddTask, updateTaskStatus as svcUpdateTaskStatus, deleteTask as svcDeleteTask } from 'src/services/taskService';
import { auth } from 'src/config/firebase';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { logoutUser as svcLogoutUser } from 'src/services/authService';

type User = {
  uid?: string;
  name?: string;
  email?: string;
} | null;

type AppState = {
  user: User;
  tasks: TaskType[];
  authInitialized: boolean;
  setUser: (u: User) => void;
  logout: () => Promise<void>;
  addTask: (t: TaskType) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
};

export const useAppStore = create<AppState>((set: any, get: any) => ({
  user: null,
  tasks: loadTasks(),
  authInitialized: false,

  setUser(u: User) {
    set({ user: u });
  },

  async logout() {
    try {
      await svcLogoutUser();
    } catch (err) {
      // ignore logout errors but still clear local state
    }
    set({ user: null, tasks: [] });
  },

  addTask(t: TaskType) {
    set((state: AppState) => {
      const next = svcAddTask(state.tasks, t);
      try { saveTasks(next); } catch (err) { /* ignore */ }
      return { tasks: next };
    });
  },

  updateTaskStatus(id: string, status: TaskStatus) {
    set((state: AppState) => {
      const next = svcUpdateTaskStatus(state.tasks, id, status);
      try { saveTasks(next); } catch (err) { /* ignore */ }
      return { tasks: next };
    });
  },

  deleteTask(id: string) {
    set((state: AppState) => {
      const next = svcDeleteTask(state.tasks, id);
      try { saveTasks(next); } catch (err) { /* ignore */ }
      return { tasks: next };
    });
  },
}));

// Listen for Firebase Auth state changes and keep the store in sync.
// Ensure auth persistence does NOT store tokens in localStorage. Use in-memory persistence so tokens
// are not written to storage by the client SDK. Server-side session should be used for persistence.
// Ensure persistence is set to local so sessions survive reloads in a frontend-only app.
setPersistence(auth, browserLocalPersistence).catch(() => {
  // ignore persistence errors (fallback to default)
});

let first = true;
onAuthStateChanged(auth, (fbUser) => {
  if (fbUser) {
    const u: User = { uid: fbUser.uid, name: fbUser.displayName ?? undefined, email: fbUser.email ?? undefined };
    useAppStore.getState().setUser(u);
  } else {
    useAppStore.getState().setUser(null);
  }

  // mark initialization after the first callback so UI can avoid flashes
  if (first) {
    first = false;
    useAppStore.setState({ authInitialized: true } as any);
  }
});

export default useAppStore;
