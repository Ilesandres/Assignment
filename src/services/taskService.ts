import { db } from 'src/config/firebase';
import type { Task as TaskType, TaskStatus } from 'src/shared';
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

const getTasksCollection = (uid: string) => {
  return collection(db, 'users', uid, 'tasks');
};

const snapshotToTask = (doc: QueryDocumentSnapshot): TaskType => {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title,
        description: data.description,
        due: data.due,
        status: data.status,
    } as TaskType;
};

export async function fetchUserTasks(uid: string): Promise<TaskType[]> {
  if (!uid) return [];
  try {
    const tasksQuery = query(getTasksCollection(uid));
    const snapshot = await getDocs(tasksQuery);
    
    return snapshot.docs.map(snapshotToTask);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    throw new Error('No se pudieron cargar las tareas.');
  }
}

export async function addTask(uid: string, task: Omit<TaskType, 'id'>): Promise<TaskType> {
  if (!uid) throw new Error('Se requiere ID de usuario.');
  try {
    const taskData = {
        ...task,
        createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(getTasksCollection(uid), taskData);
    
    return { ...task, id: docRef.id };
  } catch (error) {
    console.error("Error al agregar tarea:", error);
    throw new Error('No se pudo agregar la tarea.');
  }
}

export async function updateTaskStatus(uid: string, taskId: string, status: TaskStatus): Promise<void> {
  if (!uid) throw new Error('Se requiere ID de usuario.');
  try {
    const taskRef = doc(db, 'users', uid, 'tasks', taskId);
    await updateDoc(taskRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    throw new Error('No se pudo actualizar el estado de la tarea.');
  }
}

export async function deleteTask(uid: string, taskId: string): Promise<void> {
  if (!uid) throw new Error('Se requiere ID de usuario.');
  try {
    const taskRef = doc(db, 'users', uid, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    throw new Error('No se pudo eliminar la tarea.');
  }
}

export function groupByStatus(tasks: TaskType[]): Record<TaskStatus, TaskType[]> {
  const grouped: Record<TaskStatus, TaskType[]> = {
    'waiting': [],
    'in-progress': [],
    'completed': [],
    'abandoned': [],
  };

  tasks.forEach((t) => grouped[t.status].push(t));
  return grouped;
}

export default {
  fetchUserTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
  groupByStatus,
};