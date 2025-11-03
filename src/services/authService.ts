import { auth } from 'src/config/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export async function loginUser(email: string, password: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const u = cred.user;
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
    if (displayName) {
      try {
        await updateProfile(u, { displayName });
      } catch (e) {
        // non-fatal: profile update failed
      }
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

export default { loginUser, registerUser, logoutUser };
