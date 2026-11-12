/**
 * LessonPlayer Component
 * Full-screen lesson engine implementing the state machine:
 * QUESTION -> CHECKING -> FEEDBACK -> COMPLETE.
 * Renders exercise types, handles keyboard shortcuts, progress, and hearts.
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLessonStore, LESSON_STATUS } from '../../store/lessonStore.js';
import ProgressBar from './ProgressBar.jsx';
import FeedbackSheet from './FeedbackSheet.jsx';
import QuitConfirmModal from './QuitConfirmModal.jsx';
import LessonComplete from './LessonComplete.jsx';
import OutOfHeartsModal from '../modals/OutOfHeartsModal.jsx';

// Exercise Type Components
import MultipleChoice from './exercises/MultipleChoice.jsx';
import MultiSelect from './exercises/MultiSelect.jsx';
import TrueFalse from './exercises/TrueFalse.jsx';
import FillBlank from './exercises/FillBlank.jsx';
import MatchPairs from './exercises/MatchPairs.jsx';
import OrderSteps from './exercises/OrderSteps.jsx';
import Scenario from './exercises/Scenario.jsx';
import SpotTheThreat from './exercises/SpotTheThreat.jsx';
import CommandComplete from './exercises/CommandComplete.jsx';
import InfoCard from './exercises/InfoCard.jsx';

export default function LessonPlayer({ onExitLesson }) {
  const {
    status,
    lesson,
    unit,
    queue,
    initialQueueLength,
    selectedAnswer,
    feedback,
    heartsLeft,
    isOutOfHearts,
    correctFirstTryCount,
    totalSubmissions,
    startTime,
    endTime,
    setAnswer,
    checkAnswer,
    continueNext,
    resetLesson
  } = useLessonStore();

  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showHeartsModal, setShowHeartsModal] = useState(false);

  const currentExercise = queue[0] || null;

  // Track if hearts reach 0
  useEffect(() => {
    if (isOutOfHearts && status !== LESSON_STATUS.COMPLETE) {
      setShowHeartsModal(true);
    }
  }, [isOutOfHearts, status]);

  // Keyboard navigation: 1-4 to pick options, Enter to Check/Continue
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status === LESSON_STATUS.QUESTION && currentExercise) {
        // Numerical shortcut 1-4 for multiple choice or scenario
        if (
          (currentExercise.type === 'multiple_choice' || currentExercise.type === 'scenario') &&
          ['1', '2', '3', '4'].includes(e.key)
        ) {
          const index = parseInt(e.key, 10) - 1;
          if (index < (currentExercise.options?.length || 0)) {
            setAnswer(index);
          }
        }

        // Enter key to check answer if answer exists
        if (e.key === 'Enter' && selectedAnswer !== null) {
          e.preventDefault();
          checkAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, currentExercise, selectedAnswer, setAnswer, checkAnswer]);

  // Quit Lesson handler
  const handleConfirmQuit = () => {
    resetLesson();
    setShowQuitModal(false);
    onExitLesson();
  };

  // Complete handler
  const handleFinishLesson = () => {
    resetLesson();
    onExitLesson();
  };

  // Calculate Progress %: (initialQueueLength - queue.length) / initialQueueLength
  const completedCount = Math.max(0, initialQueueLength - queue.length);
  const progressPercent = initialQueueLength > 0 ? (completedCount / initialQueueLength) * 100 : 0;

  // Render Lesson Complete Screen
  if (status === LESSON_STATUS.COMPLETE) {
    const durationSeconds = startTime && endTime ? Math.max(15, Math.round((endTime - startTime) / 1000)) : 45;
    const accuracyPercent = totalSubmissions > 0 ? Math.round((correctFirstTryCount / totalSubmissions) * 100) : 100;
    const isPerfect = accuracyPercent >= 100;

    return (
      <LessonComplete
        lesson={lesson}
        unit={unit}
        accuracyPercent={accuracyPercent}
        durationSeconds={durationSeconds}
        isPerfect={isPerfect}
        onContinue={handleFinishLesson}
      />
    );
  }

  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine if Check button is active
  const hasAnswer =
    currentExercise.type === 'info_card' ||
    (Array.isArray(selectedAnswer) ? selectedAnswer.length > 0 : selectedAnswer !== null);

  // Render the current exercise component
  const renderExerciseComponent = () => {
    const commonProps = {
      exercise: currentExercise,
      answer: selectedAnswer,
      onAnswerChange: setAnswer,
      disabled: status !== LESSON_STATUS.QUESTION,
      status: feedback ? (feedback.isCorrect ? 'correct' : 'incorrect') : 'idle'
    };

    switch (currentExercise.type) {
      case 'multiple_choice':
        return <MultipleChoice {...commonProps} />;
      case 'multi_select':
        return <MultiSelect {...commonProps} />;
      case 'true_false':
        return <TrueFalse {...commonProps} />;
      case 'fill_blank':
        return <FillBlank {...commonProps} />;
      case 'match_pairs':
        return <MatchPairs {...commonProps} />;
      case 'order_steps':
        return <OrderSteps {...commonProps} />;
      case 'scenario':
        return <Scenario {...commonProps} />;
      case 'spot_the_threat':
        return <SpotTheThreat {...commonProps} />;
      case 'command_complete':
        return <CommandComplete {...commonProps} />;
      case 'info_card':
        return <InfoCard {...commonProps} />;
      default:
        return <div>Exercise type &quot;{currentExercise.type}&quot; not supported yet.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between max-w-[480px] mx-auto p-4 select-none">
      {/* Top Progress & Health Bar */}
      <div className="flex flex-col w-full">
        <ProgressBar
          progressPercent={progressPercent}
          hearts={heartsLeft}
          onQuit={() => setShowQuitModal(true)}
        />

        {/* Exercise Header & Prompt */}
        <div className="mt-2">
          {currentExercise.type !== 'info_card' && (
            <h2 className="font-extrabold text-lg sm:text-xl text-on-surface leading-snug">
              {currentExercise.prompt}
            </h2>
          )}
        </div>

        {/* Exercise Body */}
        <div className="w-full pb-24">
          {renderExerciseComponent()}
        </div>
      </div>

      {/* Pinned Bottom Check Button (When feedback drawer is not showing) */}
      {status === LESSON_STATUS.QUESTION && (
        <aside className="fixed bottom-0 inset-x-0 max-w-[480px] mx-auto px-4 pb-safe pt-3 bg-surface/95 backdrop-blur-md z-30 border-t border-outline-variant/30">
          <button
            onClick={checkAnswer}
            disabled={!hasAnswer}
            className={`btn-tactile w-full py-4 text-base tracking-wider uppercase flex items-center justify-center gap-2 ${
              hasAnswer ? 'btn-primary' : 'btn-disabled'
            }`}
            type="button"
          >
            <span>{currentExercise.type === 'info_card' ? 'Continue' : 'Check'}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </aside>
      )}

      {/* Bottom Feedback Sheet (Slide up on Answer Check) */}
      {status === LESSON_STATUS.FEEDBACK && feedback && (
        <FeedbackSheet
          isCorrect={feedback.isCorrect}
          correctAnswer={feedback.correctAnswer}
          explanation={feedback.explanation}
          onContinue={continueNext}
        />
      )}

      {/* Quit Lesson Confirmation Modal */}
      {showQuitModal && (
        <QuitConfirmModal
          isOpen={showQuitModal}
          onClose={() => setShowQuitModal(false)}
          onConfirmQuit={handleConfirmQuit}
        />
      )}

      {/* Out of Hearts Modal */}
      {showHeartsModal && (
        <OutOfHeartsModal
          isOpen={showHeartsModal}
          onClose={() => setShowHeartsModal(false)}
          onPracticeClick={handleConfirmQuit}
        />
      )}
    </div>
  );
}

LessonPlayer.propTypes = {
  onExitLesson: PropTypes.func.isRequired
};
