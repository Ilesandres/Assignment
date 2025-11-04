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

// Top-level tasks collection with owner field. All exported functions
// filter by ownerId and normalize Firestore timestamps to ISO strings.

function normalizeDoc(d: any): TaskType {
  const data = d.data ? d.data() : d;
  const raw = d.data ? d.data() : data;
  const due = raw.due
    ? raw.due.seconds
      ? new Date(raw.due.seconds * 1000).toISOString()
      : String(raw.due)
    : undefined;
  return {
    id: d.id,
    title: raw.title || '',
    description: raw.description || '',
    status: raw.status || 'waiting',
    due,
    owner: raw.owner,
  } as TaskType;
}

export function subscribeToUserTasks(ownerId: string, onUpdate: (tasks: TaskType[]) => void) {
  if (!ownerId) return () => {};
  // Listen to two possible locations:
  // 1) top-level `tasks` collection where documents have `owner` field
  // 2) legacy per-user subcollection `users/{uid}/tasks`
  const colTop = collection(db, 'tasks');
  const qTop = query(colTop, where('owner', '==', ownerId), orderBy('due', 'asc'));

  const colSub = collection(db, 'users', ownerId, 'tasks');

  let latestTop: Record<string, TaskType> = {};
  let latestSub: Record<string, TaskType> = {};

  function emit() {
    const merged = { ...latestTop, ...latestSub };
    const arr = Object.values(merged).sort((a, b) => {
      const da = a.due ? new Date(a.due).getTime() : 0;
      const dbt = b.due ? new Date(b.due).getTime() : 0;
      return da - dbt;
    });
    onUpdate(arr as TaskType[]);
  }

  let unsubTop: (() => void) | null = null;
  // attach an error handler so permission-denied doesn't become an uncaught error
  unsubTop = onSnapshot(
    qTop,
    (snap) => {
      const tasks: Record<string, TaskType> = {};
      snap.forEach((d) => {
        const t = normalizeDoc(d);
        tasks[t.id] = t;
      });
      latestTop = tasks;
      emit();
    },
    (err: any) => {
      // If permissions prevent reading top-level tasks, stop that listener and
      // continue using the legacy per-user subcollection only.
      try {
        if (err && err.code === 'permission-denied') {
          console.warn('[firestoreService] top-level tasks listener permission denied, disabling top-level listener.');
        } else {
          console.error('[firestoreService] snapshot error (top-level):', err);
        }
      } finally {
        try { if (unsubTop) unsubTop(); } catch (e) {}
        latestTop = {};
        emit();
      }
    }
  );

  const unsubSub = onSnapshot(colSub, (snap) => {
    const tasks: Record<string, TaskType> = {};
    snap.forEach((d) => {
      const data = d.data();
      const due = data.due ? (data.due.seconds ? new Date(data.due.seconds * 1000).toISOString() : String(data.due)) : undefined;
      tasks[d.id] = {
        id: d.id,
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'waiting',
        due,
        owner: ownerId,
      } as TaskType;
    });
    latestSub = tasks;
    emit();
  });

  return () => {
    try { unsubTop(); } catch (e) {}
    try { unsubSub(); } catch (e) {}
  };
}

export async function getUserTasksOnce(ownerId: string) {
  if (!ownerId) return [] as TaskType[];
  // gather from top-level tasks with owner
  const colTop = collection(db, 'tasks');
  const qTop = query(colTop, where('owner', '==', ownerId), orderBy('due', 'asc'));
  const map: Record<string, TaskType> = {};
  try {
    const snapTop = await getDocs(qTop);
    snapTop.forEach((d) => {
      const t = normalizeDoc(d);
      map[t.id] = t;
    });
  } catch (err: any) {
    if (err && err.code === 'permission-denied') {
      // permission denied when reading top-level tasks: ignore and
      // proceed to try the legacy subcollection
      console.warn('[firestoreService] getUserTasksOnce: permission-denied for top-level tasks, falling back to users/{uid}/tasks');
    } else {
      throw err;
    }
  }

  // also gather from legacy per-user subcollection
  const colSub = collection(db, 'users', ownerId, 'tasks');
  try {
    const snapSub = await getDocs(colSub);
    snapSub.forEach((d) => {
      const data = d.data() as any;
      const due = data.due ? (data.due.seconds ? new Date(data.due.seconds * 1000).toISOString() : String(data.due)) : undefined;
      map[d.id] = {
        id: d.id,
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'waiting',
        due,
        owner: ownerId,
      } as TaskType;
    });
  } catch (e) {
    // ignore if subcollection doesn't exist or permission denied
  }

  const list = Object.values(map).sort((a, b) => {
    const da = a.due ? new Date(a.due).getTime() : 0;
    const dbt = b.due ? new Date(b.due).getTime() : 0;
    return da - dbt;
  });
  return list;
}

export async function addTaskFirestore(task: Partial<TaskType> & { owner: string }) {
  const col = collection(db, 'tasks');
  const payload: any = {
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'waiting',
    due: task.due ?? null,
    owner: task.owner,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(col, payload);
  return ref.id;
}

export async function updateTaskFirestore(id: string, patch: Partial<TaskType>) {
  const ref = doc(db, 'tasks', id);
  const payload = { ...patch } as any;
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
