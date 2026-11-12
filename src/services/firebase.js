/**
 * Firebase Client SDK Initialization & Configuration
 * Provides Auth, Firestore (with offline persistence), and Cloud Functions instances.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cyberlingo-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cyberlingo-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cyberlingo-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890'
};

// Initialize or reuse Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with multi-tab persistent offline cache
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const auth = getAuth(app);
const functions = getFunctions(app);

// Connect to local emulators if configured
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  const host = import.meta.env.VITE_EMULATOR_HOST || 'localhost';
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, host, 8080);
  connectFunctionsEmulator(functions, host, 5001);
  console.info('🔌 Connected to Firebase Emulator Suite at', host);
}

export { app, auth, db, functions };

