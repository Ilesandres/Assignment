import { db } from 'src/config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import type { Task as TaskType } from 'src/shared';

// Subscribe to tasks for a given owner (real-time). Returns unsubscribe function.
export function subscribeToUserTasks(ownerId: string, onUpdate: (tasks: TaskType[]) => void) {
  if (!ownerId) return () => {};
  const col = collection(db, 'tasks');
  const q = query(col, where('owner', '==', ownerId), orderBy('due', 'asc'));
  const unsub = onSnapshot(q, (snap) => {
    const tasks: TaskType[] = [];
    snap.forEach((d) => {
      const data = d.data() as any;
      tasks.push({ id: d.id, title: data.title || '', description: data.description || '', status: data.status || 'waiting', due: data.due ? (data.due.seconds ? new Date(data.due.seconds * 1000).toISOString() : String(data.due)) : undefined, owner: data.owner });
    });
    onUpdate(tasks);
  });
  return unsub;
}

export async function getUserTasksOnce(ownerId: string) {
  if (!ownerId) return [] as TaskType[];
  const col = collection(db, 'tasks');
  const q = query(col, where('owner', '==', ownerId), orderBy('due', 'asc'));
  const snap = await getDocs(q);
  const tasks: TaskType[] = [];
  snap.forEach((d) => {
    const data = d.data() as any;
    tasks.push({ id: d.id, title: data.title || '', description: data.description || '', status: data.status || 'waiting', due: data.due ? (data.due.seconds ? new Date(data.due.seconds * 1000).toISOString() : String(data.due)) : undefined, owner: data.owner });
  });
  return tasks;
}

export async function addTaskFirestore(task: TaskType) {
  const col = collection(db, 'tasks');
  const payload = { ...task, createdAt: serverTimestamp() } as any;
  // remove id if present
  if (payload.id) delete payload.id;
  const ref = await addDoc(col, payload);
  return ref.id;
}

export async function updateTaskFirestore(id: string, patch: Partial<TaskType>) {
  const ref = doc(db, 'tasks', id);
  const payload = { ...patch } as any;
  // don't set id
  if (payload.id) delete payload.id;
  await updateDoc(ref, payload);
}

export async function deleteTaskFirestore(id: string) {
  const ref = doc(db, 'tasks', id);
  await deleteDoc(ref);
}

export default {
  subscribeToUserTasks,
  getUserTasksOnce,
  addTaskFirestore,
  updateTaskFirestore,
  deleteTaskFirestore,
};
