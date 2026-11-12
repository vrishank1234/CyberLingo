import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLessonStore, LESSON_STATUS } from '../store/lessonStore.js';
import { useUserStore } from '../store/userStore.js';

// Mock audio sounds to avoid Web Audio context errors in Node/jsdom
vi.mock('../lib/sound.js', () => ({
  playCorrectSound: vi.fn(),
  playWrongSound: vi.fn(),
  playCompleteSound: vi.fn()
}));

describe('Lesson Store State Machine & Flow', () => {
  const sampleLesson = {
    id: 'lesson-1',
    title: 'CIA Triad Fundamentals',
    exercises: [
      {
        id: 'ex-1',
        type: 'multiple_choice',
        prompt: 'What does C stand for?',
        options: ['Confidentiality', 'Crypto', 'Cyber'],
        answer: 0,
        explanation: 'C stands for Confidentiality.'
      },
      {
        id: 'ex-2',
        type: 'true_false',
        prompt: 'Availability means data is accessible when needed.',
        answer: true,
        explanation: 'Availability ensures access.'
      }
    ]
  };

  const sampleUnit = {
    id: 'unit-1',
    title: 'Security Core'
  };

  beforeEach(() => {
    // Reset stores
    useUserStore.setState({
      hearts: 5,
      heartsUpdatedAt: Date.now(),
      xpTotal: 0,
      gems: 500
    });
    useLessonStore.getState().resetLesson();
  });

  it('initializes lesson properly into QUESTION state', () => {
    const store = useLessonStore.getState();
    store.initLesson(sampleLesson, sampleUnit);

    const state = useLessonStore.getState();
    expect(state.status).toBe(LESSON_STATUS.QUESTION);
    expect(state.queue.length).toBe(2);
    expect(state.queue[0].id).toBe('ex-1');
    expect(state.initialQueueLength).toBe(2);
    expect(state.selectedAnswer).toBeNull();
    expect(state.mistakes).toEqual([]);
    expect(state.heartsLeft).toBe(5);
  });

  it('updates selectedAnswer during QUESTION phase', () => {
    const store = useLessonStore.getState();
    store.initLesson(sampleLesson, sampleUnit);

    store.setAnswer(0);
    expect(useLessonStore.getState().selectedAnswer).toBe(0);
  });

  it('handles a correct answer: moves to FEEDBACK and pops on continue', () => {
    const store = useLessonStore.getState();
    store.initLesson(sampleLesson, sampleUnit);

    // Answer ex-1 correctly
    store.setAnswer(0);
    const result = store.checkAnswer();

    expect(result.correct).toBe(true);
    let state = useLessonStore.getState();
    expect(state.status).toBe(LESSON_STATUS.FEEDBACK);
    expect(state.feedback.isCorrect).toBe(true);
    expect(state.correctFirstTryCount).toBe(1);

    // Continue to next exercise
    const continueRes = store.continueNext();
    expect(continueRes.complete).toBe(false);

    state = useLessonStore.getState();
    expect(state.status).toBe(LESSON_STATUS.QUESTION);
    expect(state.queue.length).toBe(1);
    expect(state.queue[0].id).toBe('ex-2');
  });

  it('handles an incorrect answer: deducts heart and requeues exercise to the end', () => {
    const store = useLessonStore.getState();
    store.initLesson(sampleLesson, sampleUnit);

    // Answer ex-1 incorrectly
    store.setAnswer(1); // Incorrect!
    const result = store.checkAnswer();

    expect(result.correct).toBe(false);
    let state = useLessonStore.getState();
    expect(state.status).toBe(LESSON_STATUS.FEEDBACK);
    expect(state.feedback.isCorrect).toBe(false);
    expect(state.mistakes).toContain('ex-1');
    expect(state.heartsLeft).toBe(4);
    // User store heart deducted
    expect(useUserStore.getState().hearts).toBe(4);

    // Re-queued to end: queue is now [ex-2, ex-1]
    expect(state.queue[0].id).toBe('ex-2');
    expect(state.queue[1].id).toBe('ex-1');

    // Continue advances to next question in queue
    store.continueNext();
    state = useLessonStore.getState();
    expect(state.status).toBe(LESSON_STATUS.QUESTION);
    expect(state.queue.length).toBe(2);
    expect(state.queue[0].id).toBe('ex-2');
  });

  it('transitions to COMPLETE state when all queued exercises are solved', () => {
    const singleExerciseLesson = {
      id: 'lesson-quick',
      title: 'Quick Check',
      exercises: [sampleLesson.exercises[0]]
    };

    const store = useLessonStore.getState();
    store.initLesson(singleExerciseLesson, sampleUnit);

    store.setAnswer(0); // correct
    store.checkAnswer();

    const continueRes = store.continueNext();
    expect(continueRes.complete).toBe(true);

    const state = useLessonStore.getState();
    expect(state.status).toBe(LESSON_STATUS.COMPLETE);
    expect(state.queue.length).toBe(0);
    expect(state.endTime).not.toBeNull();
  });
});
