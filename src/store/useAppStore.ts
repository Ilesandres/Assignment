import { create } from 'zustand';
import type { Task as TaskType, TaskStatus } from 'src/shared';
import { loadTasks, saveTasks, addTask as svcAddTask, updateTaskStatus as svcUpdateTaskStatus, deleteTask as svcDeleteTask } from 'src/services/taskService';
import { auth } from 'src/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { logoutUser as svcLogoutUser } from 'src/services/authService';

type User = {
  uid?: string;
  name?: string;
  email?: string;
} | null;

type AppState = {
  user: User;
  tasks: TaskType[];
  setUser: (u: User) => void;
  logout: () => Promise<void>;
  addTask: (t: TaskType) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
};

export const useAppStore = create<AppState>((set: any, get: any) => ({
  // start unauthenticated; onAuthStateChanged will populate when Firebase reports a user
  user: null,
  tasks: loadTasks(),

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
onAuthStateChanged(auth, (fbUser) => {
  if (fbUser) {
    const u: User = { uid: fbUser.uid, name: fbUser.displayName ?? undefined, email: fbUser.email ?? undefined };
    useAppStore.getState().setUser(u);
  } else {
    useAppStore.getState().setUser(null);
  }
});

export default useAppStore;
