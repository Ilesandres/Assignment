import { db } from 'src/config/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentData,
  type QuerySnapshot,
  type DocumentReference,
} from 'firebase/firestore';
import type { Task as TaskType, TaskStatus, UserProfile } from 'src/shared/types';
import type { Unsubscribe } from 'firebase/auth';

/**
 * Convierte un documento de Firestore a un objeto Typed de TypeScript.
 */
const normalizeDoc = <T>(doc: DocumentData): T & { id: string } => ({
  ...(doc.data() as T),
  id: doc.id,
});


// =========================================================================
// COLECCIONES Y REFERENCIAS
// =========================================================================

// La colección principal para los perfiles de usuario
const profilesCollection = collection(db, 'userProfiles');


// =========================================================================
// FUNCIONES DE PERFIL (MANTENER Y CORREGIR)
// =========================================================================

/**
 * Crea un perfil de usuario inicial después del registro.
 */
export async function createUserProfile(uid: string, email: string, displayName?: string): Promise<void> {
  const profileDocRef = doc(profilesCollection, uid);
  const timestamp = serverTimestamp(); // FieldValue (Firestore timestamp placeholder)
  
  // CORRECCIÓN: Incluir todas las propiedades requeridas por UserProfile
  const initialProfile: UserProfile = { 
    uid,
    email,
    displayName: displayName || null,
    // Propiedades que faltaban:
    photoURL: `https://i.pravatar.cc/150?u=${uid}`, // Valor predeterminado para satisfacer el tipo
    phone: null,
    location: null,
    memberSince: new Date().toISOString(), // Valor predeterminado para satisfacer el tipo
    // Timestamps
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await setDoc(profileDocRef, initialProfile);
}

/**
 * Obtiene el perfil de un usuario una sola vez.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const profileDocRef = doc(profilesCollection, uid);
  const docSnap = await getDoc(profileDocRef);

  if (docSnap.exists()) {
    return normalizeDoc<UserProfile>(docSnap) as UserProfile;
  }
  return null;
}

/**
 * Actualiza parcialmente un perfil de usuario.
 */
export async function updateUserProfile(uid: string, patch: Partial<UserProfile>): Promise<void> {
  const profileDocRef = doc(profilesCollection, uid);
  // Aseguramos que solo se envíen campos actualizables
  const payload = { ...patch, updatedAt: serverTimestamp() };
  delete (payload as any).uid;
  delete (payload as any).createdAt;
  delete (payload as any).email;
  delete (payload as any).memberSince;

  await updateDoc(profileDocRef, payload as DocumentData);
}

/**
 * Suscribe un listener a los cambios del perfil del usuario (Real-time).
 */
export function subscribeToUserProfile(uid: string, onUpdate: (profile: UserProfile) => void): Unsubscribe {
  const profileDocRef = doc(profilesCollection, uid);
  return onSnapshot(profileDocRef, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(normalizeDoc<UserProfile>(docSnap) as UserProfile);
    }
  });
}

// =========================================================================
// FUNCIONES DE TAREAS (OBSOLETAS - COMENTADAS PARA USAR FASTAPI)
// =========================================================================

// Hemos comentado las funciones de Tareas aquí para forzar el uso 
// de los endpoints de FastAPI y cumplir con la arquitectura.

/**
 * [OBSOLETO - USAR FASTAPI]: Suscribe un listener a las tareas del usuario (Real-time).
 */
/*
export function subscribeToUserTasks(ownerId: string, onUpdate: (tasks: TaskType[]) => void): Unsubscribe {
  console.warn('[DEPRECATED] Use FastAPI API for task fetching.');
  return () => {};
}
*/

/**
 * [OBSOLETO - USAR FASTAPI]: Obtiene las tareas de un usuario una sola vez.
 */
/*
export async function getUserTasksOnce(ownerId: string): Promise<TaskType[]> {
  console.warn('[DEPRECATED] Use FastAPI API for task fetching.');
  return [];
}
*/

/**
 * [OBSOLETO - USAR FASTAPI]: Agrega una nueva tarea.
 */
/*
export async function addTaskFirestore(task: Omit<TaskType, 'id'> & { owner: string }): Promise<TaskType> {
  throw new Error('[DEPRECATED] Use FastAPI endpoint: POST /tasks/');
}
*/

/**
 * [OBSOLETO - USAR FASTAPI]: Actualiza una tarea.
 */
/*
export async function updateTaskFirestore(id: string, patch: Partial<TaskType>): Promise<void> {
  throw new Error('[DEPRECATED] Use FastAPI endpoint: PUT /tasks/{id}');
}
*/

/**
 * [OBSOLETO - USAR FASTAPI]: Elimina una tarea.
 */
/*
export async function deleteTaskFirestore(id: string): Promise<void> {
  throw new Error('[DEPRECATED] Use FastAPI endpoint: DELETE /tasks/{id}');
}
*/