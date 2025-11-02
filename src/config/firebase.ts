import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_APIKEY ?? import.meta.env.APIKEY) as string | undefined,
  authDomain: (import.meta.env.VITE_AUTHDOMAIN ?? import.meta.env.AUTHDOMAIN) as string | undefined,
  projectId: (import.meta.env.VITE_PROJECTID ?? import.meta.env.PROJECTID) as string | undefined,
  storageBucket: (import.meta.env.VITE_STORAGEBUCKET ?? import.meta.env.STORAGEBUCKET) as string | undefined,
  messagingSenderId: (import.meta.env.VITE_MESSAGINGSENDERID ?? import.meta.env.MESSAGINGSENDERID) as string | undefined,
  appId: (import.meta.env.VITE_APPID ?? import.meta.env.APPID) as string | undefined,
  measurementId: (import.meta.env.VITE_MEASUREMENTID ?? import.meta.env.MEASUREMENTID) as string | undefined,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('Firebase config looks incomplete. Set VITE_APIKEY and VITE_PROJECTID in your .env');
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
