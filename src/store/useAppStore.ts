import { create } from 'zustand';
import type { Task as TaskType, TaskStatus } from 'src/shared';
import { loadTasks, saveTasks, addTask as svcAddTask, updateTaskStatus as svcUpdateTaskStatus, deleteTask as svcDeleteTask } from 'src/services/taskService';

type User = {
  name?: string;
  email?: string;
} | null;

type AppState = {
  user: User;
  tasks: TaskType[];
  setUser: (u: User) => void;
  logout: () => void;
  addTask: (t: TaskType) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
};

export const useAppStore = create<AppState>((set: any, get: any) => ({
  // initial demo user so profile shows something; can be null in production
  user: { name: 'Marlon Moncayo', email: 'marlon@example.com' },
  tasks: loadTasks(),

  setUser(u: User) {
    set({ user: u });
  },

  logout() {
    set({ user: null });
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

export default useAppStore;
