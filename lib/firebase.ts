import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMmM1UHhV9MbaW0ODfikt0d6eZ0s7o3BA",
  authDomain: "spider-landing.firebaseapp.com",
  projectId: "spider-landing",
  storageBucket: "spider-landing.firebasestorage.app",
  messagingSenderId: "974342110921",
  appId: "1:974342110921:web:c1cf1c466e05045bd89718",
  measurementId: "G-YDB3FJK8S7"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);