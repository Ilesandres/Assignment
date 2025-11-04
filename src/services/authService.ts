import { auth } from 'src/config/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { createUserProfile, getUserProfile } from './firestoreService';

export async function loginUser(email: string, password: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const u = cred.user;
    
    // Verificar si el perfil existe en Firestore, si no, crearlo (para usuarios legacy)
    try {
      const existingProfile = await getUserProfile(u.uid);
      if (!existingProfile) {
        console.log('📝 Usuario legacy detectado, creando perfil en Firestore...');
        await createUserProfile(u.uid, u.email || email, u.displayName || undefined);
        console.log('✅ Perfil creado para usuario existente');
      }
    } catch (profileError) {
      console.warn('⚠️ No se pudo verificar/crear el perfil del usuario:', profileError);
      // No lanzar error, permitir que el login continúe
    }
    
    console.log(u);
    return {
      uid: u.uid,
      name: u.displayName ?? undefined,
      email: u.email ?? undefined,
    };
  } catch (err) {
    throw err;
  }
}

export async function registerUser(email: string, password: string, displayName?: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const u = cred.user;
    
    // Actualizar el perfil de Firebase Auth con el displayName
    if (displayName) {
      try {
        await updateProfile(u, { displayName });
      } catch (e) {
        console.warn('Profile update failed:', e);
      }
    }
    
    // Crear el perfil en Firestore automáticamente
    try {
      await createUserProfile(u.uid, email, displayName);
      console.log('✅ User profile created in Firestore');
    } catch (e) {
      console.error('❌ Error creating user profile in Firestore:', e);
      // No lanzar error, el usuario ya fue creado en Auth
    }
    
    return {
      uid: u.uid,
      name: u.displayName ?? displayName ?? undefined,
      email: u.email ?? undefined,
    };
  } catch (err) {
    throw err;
  }
}

export async function logoutUser() {
  await signOut(auth);
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const token = await user.getIdToken(forceRefresh);
    return token;
  } catch (err) {
    return null;
  }
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = await getIdToken();
  const headers = new Headers(init?.headers || {} as HeadersInit);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  // default credentials same-origin so cookies (if any) are sent
  const finalInit: RequestInit = { ...init, headers, credentials: init?.credentials ?? 'same-origin' };
  return fetch(input, finalInit);
}

export default { loginUser, registerUser, logoutUser, getIdToken, fetchWithAuth };

// Remove sensitive entries from localStorage (firebase auth entries and app-specific keys)
export function clearLocalAuthStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      // remove firebase auth entries and any app_tasks or similar keys
      if (key.startsWith('firebase:') || key.includes('app_tasks')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    // ignore in environments without localStorage
  }
}
