// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getOrInitializeAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  projectId: 'studio-2775585837-1c446',
  appId: '1:1091828136369:web:bf6ffaf925b38062a4e590',
  apiKey: 'AIzaSyA15GPBJU-MENBpI1yR2NLzs-fd9QDLf1Y',
  authDomain: 'studio-2775585837-1c446.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '1091828136369',
  storageBucket: 'studio-2775585837-1c446.appspot.com',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, type User };
