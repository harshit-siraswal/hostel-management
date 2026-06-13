import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { saveAuthSession } from "./auth";
import type { Role } from "./hostel-data";

type FirebaseEnv = ImportMetaEnv & {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
};

function getFirebaseEnv() {
  return import.meta.env as FirebaseEnv;
}

export function hasFirebaseConfig() {
  const env = getFirebaseEnv();
  return Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_AUTH_DOMAIN && env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_APP_ID);
}

export function getFirebaseApp() {
  if (!hasFirebaseConfig()) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  const env = getFirebaseEnv();
  return initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  });
}

export async function signInWithFirebaseCredentials(email: string, password: string, role: Role) {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured in this environment.");
  }

  const auth = getAuth(app);
  const result = await signInWithEmailAndPassword(auth, email, password);
  const token = await result.user.getIdToken();

  saveAuthSession({
    provider: "firebase",
    role,
    email: result.user.email || email,
    token,
    uid: result.user.uid,
    displayName: result.user.displayName,
  });

  return result.user;
}

export async function signInWithGoogle(role: Role) {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured in this environment.");
  }

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const token = await result.user.getIdToken();

  saveAuthSession({
    provider: "firebase",
    role,
    email: result.user.email || "",
    token,
    uid: result.user.uid,
    displayName: result.user.displayName,
  });

  return result.user;
}