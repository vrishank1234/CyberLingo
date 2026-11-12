/**
 * Lesson Player Store (Zustand)
 * Implements the Duolingo-style lesson state machine:
 * LOADING -> INTRO -> QUESTION -> CHECKING -> FEEDBACK -> COMPLETE
 * Handles exercise queues, re-queuing incorrect exercises, tracking mistakes,
 * accuracy, time, and heart loss.
 */

import { create } from 'zustand';
import { validateExercise } from '../lib/validators.js';
import { playCorrectSound, playWrongSound, playCompleteSound } from '../lib/sound.js';
import { useUserStore } from './userStore.js';

export const LESSON_STATUS = {
  LOADING: 'LOADING',
  INTRO: 'INTRO',
  QUESTION: 'QUESTION',
  CHECKING: 'CHECKING',
  FEEDBACK: 'FEEDBACK',
  COMPLETE: 'COMPLETE'
};

export const useLessonStore = create((set, get) => ({
  status: LESSON_STATUS.LOADING,
  lesson: null,
  unit: null,
  queue: [], // Remaining exercises in order
  initialQueueLength: 0,
  selectedAnswer: null,
  feedback: null, // { isCorrect: boolean, correctAnswer: string, explanation: string }
  mistakes: [], // IDs of exercises answered incorrectly
  correctFirstTryCount: 0,
  totalSubmissions: 0,
  startTime: null,
  endTime: null,
  heartsLeft: 5,
  isOutOfHearts: false,

  /**
   * Initialize a new lesson session
   */
  initLesson: (lesson, unit, exercises = []) => {
    const { getEffectiveHearts } = useUserStore.getState();
    const { currentHearts } = getEffectiveHearts();

    const sanitizedQueue = exercises.length > 0 ? [...exercises] : [...(lesson.exercises || [])];

    set({
      status: LESSON_STATUS.QUESTION,
      lesson,
      unit,
      queue: sanitizedQueue,
      initialQueueLength: sanitizedQueue.length,
      selectedAnswer: null,
      feedback: null,
      mistakes: [],
      correctFirstTryCount: 0,
      totalSubmissions: 0,
      startTime: Date.now(),
      endTime: null,
      heartsLeft: currentHearts,
      isOutOfHearts: currentHearts <= 0
    });
  },

  /**
   * Set user's chosen answer for the active exercise
   */
  setAnswer: (answer) => {
    const { status } = get();
    if (status === LESSON_STATUS.QUESTION) {
      set({ selectedAnswer: answer });
    }
  },

  /**
   * Submit and check current answer
   */
  checkAnswer: () => {
    const { queue, selectedAnswer, status, mistakes, correctFirstTryCount, totalSubmissions } = get();
    if (status !== LESSON_STATUS.QUESTION || queue.length === 0) return null;

    const currentExercise = queue[0];
    set({ status: LESSON_STATUS.CHECKING });

    const result = validateExercise(currentExercise, selectedAnswer);
    const isFirstAttemptOnThis = !mistakes.includes(currentExercise.id);

    if (result.correct) {
      playCorrectSound();
      set({
        status: LESSON_STATUS.FEEDBACK,
        feedback: {
          isCorrect: true,
          correctAnswer: result.correctAnswer,
          explanation: result.explanation
        },
        correctFirstTryCount: isFirstAttemptOnThis ? correctFirstTryCount + 1 : correctFirstTryCount,
        totalSubmissions: totalSubmissions + 1
      });
      return { correct: true };
    } else {
      playWrongSound();
      // Deduct heart in user store
      const remainingHearts = useUserStore.getState().deductHeart();

      // Add to mistakes list if not already recorded
      const updatedMistakes = mistakes.includes(currentExercise.id)
        ? mistakes
        : [...mistakes, currentExercise.id];

      // Re-queue the wrong exercise to the very end of the line
      const updatedQueue = [...queue.slice(1), currentExercise];

      set({
        status: LESSON_STATUS.FEEDBACK,
        feedback: {
          isCorrect: false,
          correctAnswer: result.correctAnswer,
          explanation: result.explanation
        },
        queue: updatedQueue,
        mistakes: updatedMistakes,
        totalSubmissions: totalSubmissions + 1,
        heartsLeft: remainingHearts,
        isOutOfHearts: remainingHearts <= 0
      });
      return { correct: false, remainingHearts };
    }
  },

  /**
   * Advance to the next exercise or finish the lesson
   */
  continueNext: () => {
    const { queue, feedback } = get();

    // If previous was correct, remove it from head of queue
    let nextQueue = queue;
    if (feedback?.isCorrect) {
      nextQueue = queue.slice(1);
    }

    if (nextQueue.length === 0) {
      // All exercises completed!
      playCompleteSound();
      const endTime = Date.now();
      set({
        status: LESSON_STATUS.COMPLETE,
        queue: [],
        feedback: null,
        selectedAnswer: null,
        endTime
      });
      return { complete: true };
    }

    // Next question
    set({
      status: LESSON_STATUS.QUESTION,
      queue: nextQueue,
      selectedAnswer: null,
      feedback: null
    });
    return { complete: false, remaining: nextQueue.length };
  },

  /**
   * Exit lesson and reset
   */
  resetLesson: () => {
    set({
      status: LESSON_STATUS.LOADING,
      lesson: null,
      unit: null,
      queue: [],
      selectedAnswer: null,
      feedback: null,
      mistakes: [],
      startTime: null,
      endTime: null
    });
  }
}));
