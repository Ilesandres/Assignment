import { create } from 'zustand';
import type { Task as TaskType, TaskStatus } from 'src/shared';
import { 
  fetchUserTasks, 
  addTask as svcAddTask, 
  updateTaskStatus as svcUpdateTaskStatus, 
  deleteTask as svcDeleteTask 
} from 'src/services/taskService';
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
    set({ user: null, tasks: [], isLoading: false, error: null });
    auth.signOut();
  },

  async fetchTasks() {
    const { user } = get();
    if (!user?.uid) {
        set({ tasks: [], isLoading: false }); 
        return;
    }

    set({ isLoading: true, error: null });
    try {
        const fetchedTasks = await fetchUserTasks(user.uid);
        set({ tasks: fetchedTasks, isLoading: false });
    } catch (err) {
        set({ error: 'Error al cargar las tareas. Verifica tu conexión.', isLoading: false });
        console.error(err);
    }
  },

  async addTask(task: Omit<TaskType, 'id'>) {
    const { user } = get();
    if (!user?.uid) return;

    set({ isLoading: true, error: null });
    try {
        const newTask = await svcAddTask(user.uid, task);
        
        set((state) => ({ 
            tasks: [newTask, ...state.tasks], 
            isLoading: false 
        }));
    } catch (err) {
        set({ error: 'Error al agregar la tarea.', isLoading: false });
        console.error(err);
    }
  },

  async updateTaskStatus(id: string, status: TaskStatus) {
    const { user, tasks } = get();
    if (!user?.uid) return;
    
    const originalTasks = tasks;
    const optimisticTasks = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    set({ tasks: optimisticTasks, error: null, isLoading: true });

    try {
        await svcUpdateTaskStatus(user.uid, id, status);
        set({ isLoading: false }); 
    } catch (err) {
        set({ error: 'Error al actualizar el estado de la tarea. Intenta de nuevo.', tasks: originalTasks, isLoading: false });
        console.error(err);
    }
  },

  async deleteTask(id: string) {
    const { user, tasks } = get();
    if (!user?.uid) return;

    const originalTasks = tasks;
    const optimisticTasks = tasks.filter((t) => t.id !== id);
    set({ tasks: optimisticTasks, error: null, isLoading: true });

    try {
        await svcDeleteTask(user.uid, id);
        set({ isLoading: false });
    } catch (err) {
        set({ error: 'Error al eliminar la tarea. Intenta de nuevo.', tasks: originalTasks, isLoading: false });
        console.error(err);
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
        store.fetchTasks();
    } else {
        store.logout(); 
    }
    useAppStore.setState({ authChecked: true });
});

export default useAppStore;