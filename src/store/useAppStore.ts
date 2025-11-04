import { create } from 'zustand';
import type { Task as TaskType, TaskStatus } from 'src/shared';
import { 
  fetchUserTasks, 
  addTask as svcAddTask, 
  updateTaskStatus as svcUpdateTaskStatus, 
  deleteTask as svcDeleteTask 
} from 'src/services/taskService';
import { subscribeToUserTasks, getUserTasksOnce, addTaskFirestore, updateTaskFirestore, deleteTaskFirestore } from 'src/services/firestoreService';
import { auth } from 'src/config/firebase'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import type { User as FirebaseAuthUser } from 'firebase/auth';

type User = {
  uid: string;
  name?: string;
  email?: string;
} | null;

type AppState = {
  user: User;
  tasks: TaskType[];
  isLoading: boolean;
  error: string | null;
  authChecked: boolean;
  _unsubscribeTasks?: (() => void) | null;

  setUser: (u: User) => void;
  logout: () => void;
  fetchTasks: () => Promise<void>;
  addTask: (t: Omit<TaskType, 'id'>) => Promise<void>; 
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null, 
  tasks: [],
  isLoading: false,
  error: null,
  authChecked: false,

  setUser(u: User) {
    set({ user: u, error: null });
  },

  logout() {
    // unsubscribe any firestore listener
    try {
      const sub = get()._unsubscribeTasks;
      if (typeof sub === 'function') sub();
    } catch (e) {}
    set({ user: null, tasks: [], isLoading: false, error: null, _unsubscribeTasks: null });
    auth.signOut();
  },

  async fetchTasks() {
    const user = get().user;
    const uid = user?.uid || auth.currentUser?.uid;
    if (!uid) {
      set({ tasks: [], isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
        // Use Firestore once-fetch for initial load when available
        const fetchedTasks = await getUserTasksOnce(uid);
        set({ tasks: fetchedTasks, isLoading: false });
    } catch (err) {
        // fallback to older service if something fails
        try {
          const fetchedTasks = await fetchUserTasks(uid);
          set({ tasks: fetchedTasks, isLoading: false });
        } catch (e) {
          set({ error: 'Error al cargar las tareas. Verifica tu conexión.', isLoading: false });
          console.error(err);
        }
    }
  },

  async addTask(task: Omit<TaskType, 'id'>) {
    const user = get().user;
    const uid = user?.uid || auth.currentUser?.uid;
    if (!uid) return;

    set({ isLoading: true, error: null });
    try {
        // Prefer Firestore top-level collection with owner field.
        await addTaskFirestore({ ...task, owner: uid });
        // tasks will be synced via realtime subscription; clear loading
        set({ isLoading: false });
    } catch (err) {
        // fallback to older per-user collection
        try {
          const newTask = await svcAddTask(uid, task);
          set((state) => ({ tasks: [newTask, ...state.tasks], isLoading: false }));
        } catch (e) {
          set({ error: 'Error al agregar la tarea.', isLoading: false });
          console.error(err);
        }
    }
  },

  async updateTaskStatus(id: string, status: TaskStatus) {
  const { tasks } = get();
  const uid = get().user?.uid || auth.currentUser?.uid;
  if (!uid) return;
    
    const originalTasks = tasks;
    const optimisticTasks = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    set({ tasks: optimisticTasks, error: null, isLoading: true });

    try {
        // update in firestore
        await updateTaskFirestore(id, { status });
        set({ isLoading: false });
    } catch (err) {
        // fallback to older service
        try {
          await svcUpdateTaskStatus(uid, id, status);
          set({ isLoading: false });
        } catch (e) {
          set({ error: 'Error al actualizar el estado de la tarea. Intenta de nuevo.', tasks: originalTasks, isLoading: false });
          console.error(err);
        }
    }
  },

  async deleteTask(id: string) {
  const { tasks } = get();
  const uid = get().user?.uid || auth.currentUser?.uid;
  if (!uid) return;

    const originalTasks = tasks;
    const optimisticTasks = tasks.filter((t) => t.id !== id);
    set({ tasks: optimisticTasks, error: null, isLoading: true });

    try {
        await deleteTaskFirestore(id);
        set({ isLoading: false });
    } catch (err) {
        try {
          await svcDeleteTask(uid, id);
          set({ isLoading: false });
        } catch (e) {
          set({ error: 'Error al eliminar la tarea. Intenta de nuevo.', tasks: originalTasks, isLoading: false });
          console.error(err);
        }
    }
  },
}));

onAuthStateChanged(auth, (firebaseUser: FirebaseAuthUser | null) => {
    const store = useAppStore.getState();
    
    if (firebaseUser) {
        const appUser: User = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
            email: firebaseUser.email || undefined,
        };
        store.setUser(appUser);
        // unsubscribe previous listener if exists
        try {
          if (store._unsubscribeTasks) store._unsubscribeTasks();
        } catch (e) {}
        // subscribe to realtime updates for this user
        const unsub = subscribeToUserTasks(firebaseUser.uid, (tasks) => {
          useAppStore.setState({ tasks });
        });
        useAppStore.setState({ _unsubscribeTasks: unsub });
    } else {
        // logout clears state and unsubscribes
        try {
          if (store._unsubscribeTasks) store._unsubscribeTasks();
        } catch (e) {}
        store.logout(); 
    }
    useAppStore.setState({ authChecked: true });
});

export default useAppStore;