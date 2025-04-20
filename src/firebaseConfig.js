// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following placeholder values with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyArIOjmwlhrOl2Uo14Q2nUzW9EE0uAmHMM",
  authDomain: "spit-frontendodyssey-main.firebaseapp.com",
  projectId: "spit-frontendodyssey-main",
  storageBucket: "spit-frontendodyssey-main.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "422043268470",
  appId: "1:422043268470:web:003d58d2d5eef32c5ff657",
  measurementId: "G-9EB2DVMMRV"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
