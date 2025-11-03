import { auth } from 'src/config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

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
    // rethrow for caller to display
    throw err;
  }
}

export async function logoutUser() {
  await signOut(auth);
}

export default { loginUser, logoutUser };
