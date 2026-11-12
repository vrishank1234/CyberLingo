/**
 * useAuth Hook
 * Handles Firebase Authentication, Google sign-in, Email/password,
 * Anonymous guest play, and account upgrading.
 */

import { useState, useEffect } from 'react';
import {
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  linkWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase.js';
import { useUserStore } from '../store/userStore.js';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser, syncFromFirestore, resetUserSession } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userObj = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Cadet ' + firebaseUser.uid.slice(0, 4) : 'Defender'),
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || null,
            isAnonymous: firebaseUser.isAnonymous
          };
          setUser(userObj);

          // Fetch or initialize Firestore user record
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const snap = await getDoc(userDocRef);

            if (snap.exists()) {
              syncFromFirestore(snap.data());
            } else {
              // Create baseline user doc if not yet created by Cloud Function
              const defaultUserData = {
                displayName: userObj.displayName,
                photoURL: userObj.photoURL,
                email: userObj.email,
                isAnonymous: userObj.isAnonymous,
                createdAt: serverTimestamp(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
                goal: 'protect',
                level: 1,
                dailyGoalXp: 20,
                currentTrackId: 'security-fundamentals',
                xpTotal: 0,
                xpToday: 0,
                xpWeek: 0,
                gems: 150,
                hearts: 5,
                heartsUpdatedAt: Date.now(),
                streak: 1,
                longestStreak: 1,
                lastActiveDate: new Date().toISOString().split('T')[0],
                streakFreezes: 0,
                leagueId: 'bronze-league-01',
                leagueTier: 'Bronze'
              };
              await setDoc(userDocRef, defaultUserData, { merge: true });
            }
          } catch (firestoreErr) {
            console.warn('Firestore user doc sync notice (emulator/offline):', firestoreErr.message);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, syncFromFirestore]);

  // Sign in anonymously for guest play
  const playAsGuest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInAnonymously(auth);
      return res.user;
    } catch (err) {
      console.warn('Guest sign-in warning (fallback to local session):', err.message);
      // Fallback local mock user session if offline/emulator not running
      const mockUid = 'guest_' + Math.random().toString(36).substring(2, 9);
      const mockUser = {
        uid: mockUid,
        displayName: 'Cadet ' + mockUid.substring(6, 10),
        email: null,
        photoURL: null,
        isAnonymous: true
      };
      setUser(mockUser);
      return mockUser;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Email and Password
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with Email and Password
  const registerWithEmail = async (email, password, displayName = 'Defender') => {
    setLoading(true);
    setError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName });
      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upgrade anonymous guest account to Google
  const upgradeToGoogle = async () => {
    if (!auth.currentUser || !auth.currentUser.isAnonymous) {
      throw new Error('Only anonymous guest accounts can be upgraded.');
    }
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const res = await linkWithPopup(auth.currentUser, provider);
      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      resetUserSession();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return {
    user,
    loading,
    error,
    playAsGuest,
    signInWithGoogle,
    loginWithEmail,
    registerWithEmail,
    upgradeToGoogle,
    logout
  };
}

