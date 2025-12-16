import { create } from 'zustand';
import type { Task as TaskType, TaskStatus } from 'src/shared';
// Importamos solo las funciones API que se comunican con FastAPI
import { 
  fetchTasksApi, 
  createTaskApi, 
  updateTaskApi, 
  deleteTaskApi,
} from 'src/services/apiTaskService'; 
// Eliminamos la importación de fetchUserTasks de src/services/taskService para resolver el error TS2614 y TS6133
import { auth } from 'src/config/firebase'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import type { User as FirebaseAuthUser } from 'firebase/auth';
import { clearLocalAuthStorage } from 'src/services/authService';

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
  // Eliminado: _unsubscribeTasks

  setUser: (u: User) => void;
  logout: () => void;
  fetchTasks: () => Promise<void>;
  addTask: (t: Omit<TaskType, 'id' | 'owner'>) => Promise<void>;
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
    // Limpiamos el estado
    set({ user: null, tasks: [], isLoading: false, error: null });
    auth.signOut();
    clearLocalAuthStorage(); 
  },

  async fetchTasks() {
    const uid = get().user?.uid || auth.currentUser?.uid;
    if (!uid) {
      set({ tasks: [], isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
        // Llama al Backend de FastAPI
        const fetchedTasks = await fetchTasksApi(); 
        set({ tasks: fetchedTasks, isLoading: false });
    } catch (err: any) {
        set({ error: `Error al cargar las tareas: ${err.message}`, isLoading: false });
        console.error(err);
    }
  },

  async addTask(task: Omit<TaskType, 'id' | 'owner'>) {
    const uid = get().user?.uid || auth.currentUser?.uid;
    if (!uid) return;

    set({ isLoading: true, error: null });
    try {
        const newTask = await createTaskApi(task); 
        
        // Actualización optimista de la lista
        set((state) => ({ 
            tasks: [newTask, ...state.tasks], 
            isLoading: false 
        }));
    } catch (err: any) {
        set({ error: `Error al agregar la tarea: ${err.message}`, isLoading: false });
        console.error(err);
        throw err;
    }
  },

  async updateTaskStatus(id: string, status: TaskStatus) {
    const { tasks } = get();
    const uid = get().user?.uid || auth.currentUser?.uid;
    if (!uid) return;

    const existingTask = tasks.find((t) => t.id === id);
    if (!existingTask) return;

    const updatedTask: TaskType = { ...existingTask, status };
    
    // Optimistic update
    const originalTasks = tasks;
    const optimisticTasks = tasks.map((t) => (t.id === id ? updatedTask : t));
    set({ tasks: optimisticTasks, error: null });

    try {
        // Enviar la tarea actualizada al backend (PUT)
        await updateTaskApi(updatedTask); 
        set({ isLoading: false });
    } catch (err: any) {
        // Rollback on error
        set({ 
            error: `Error al actualizar el estado: ${err.message}`, 
            tasks: originalTasks, 
            isLoading: false 
        });
        console.error(err);
    }
  },

  async deleteTask(id: string) {
    const { tasks } = get();
    const uid = get().user?.uid || auth.currentUser?.uid;
    if (!uid) return;

    // Optimistic update
    const originalTasks = tasks;
    const optimisticTasks = tasks.filter((t) => t.id !== id);
    set({ tasks: optimisticTasks, error: null });

    try {
        // Eliminar la tarea a través del backend (DELETE)
        await deleteTaskApi(id); 
        set({ isLoading: false });
    } catch (err: any) {
        // Rollback on error
        set({ 
            error: `Error al eliminar la tarea: ${err.message}`, 
            tasks: originalTasks, 
            isLoading: false 
        });
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
        
        // Carga inicial de tareas usando FastAPI
        store.fetchTasks(); 

    } else {
        store.logout(); 
    }
    useAppStore.setState({ authChecked: true });
});

export default useAppStore;