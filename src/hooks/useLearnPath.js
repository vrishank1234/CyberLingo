/**
 * useLearnPath Hook
 * Caches and retrieves learning tracks, units, and lessons using React Query.
 * Seamlessly falls back to local content JSON for zero-latency and offline PWA capability.
 */

import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase.js';
import localTrackData from '../../content/security-fundamentals.json';
import { useUserStore } from '../store/userStore.js';

export function useLearnPath(trackId = 'security-fundamentals') {
  const { completedLessons, currentLessonId } = useUserStore();

  const queryResult = useQuery({
    queryKey: ['learnPath', trackId],
    queryFn: async () => {
      try {
        // Attempt to fetch from Firestore
        const trackRef = doc(db, 'tracks', trackId);
        const trackSnap = await getDoc(trackRef);

        if (trackSnap.exists()) {
          const trackData = trackSnap.data();
          const unitsCol = collection(db, 'tracks', trackId, 'units');
          const unitsSnap = await getDocs(query(unitsCol, orderBy('order', 'asc')));

          const units = [];
          for (const unitDoc of unitsSnap.docs) {
            const unitData = unitDoc.data();
            const lessonsCol = collection(db, 'tracks', trackId, 'units', unitDoc.id, 'lessons');
            const lessonsSnap = await getDocs(query(lessonsCol, orderBy('order', 'asc')));

            const lessons = lessonsSnap.docs.map((ld) => ({
              lessonId: ld.id,
              ...ld.data()
            }));

            units.push({
              unitId: unitDoc.id,
              ...unitData,
              lessons
            });
          }

          return {
            trackId,
            ...trackData,
            units
          };
        }
      } catch (err) {
        console.info('Using embedded track content for offline/fast mode:', err.message);
      }

      // Fallback: bundled track content
      return localTrackData;
    },
    staleTime: 1000 * 60 * 30, // 30 mins
    initialData: localTrackData
  });

  const track = queryResult.data || localTrackData;

  /**
   * Determine the state of a lesson node: 'completed', 'active', or 'locked'
   */
  const getLessonState = (lessonId, unitIndex, lessonIndex) => {
    // If it's in completedLessons, it's completed
    if (completedLessons.includes(lessonId)) {
      return 'completed';
    }

    // First lesson of Unit 1 is always active if nothing is completed
    if (unitIndex === 0 && lessonIndex === 0 && completedLessons.length === 0) {
      return 'active';
    }

    // If it matches currentLessonId, it's active
    if (currentLessonId === lessonId) {
      return 'active';
    }

    // Sequential unlocking check:
    // Flatten all lessons across units in order
    const allLessons = [];
    track.units?.forEach((u) => {
      u.lessons?.forEach((l) => allLessons.push(l.lessonId));
    });

    const currentIndex = allLessons.indexOf(lessonId);
    if (currentIndex > 0) {
      const prevLessonId = allLessons[currentIndex - 1];
      if (completedLessons.includes(prevLessonId)) {
        return 'active';
      }
    }

    return 'locked';
  };

  return {
    ...queryResult,
    track,
    getLessonState
  };
}

