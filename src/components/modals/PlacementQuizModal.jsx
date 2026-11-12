/**
 * PlacementQuizModal Component
 * Optional 3-question placement quiz allowing experienced cadets to jump ahead or test their skill.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import Mascot from '../ui/Mascot.jsx';

const PLACEMENT_QUESTIONS = [
  {
    prompt: 'Which hashing algorithm is cryptographically broken and obsolete?',
    options: ['SHA-256', 'MD5', 'Bcrypt', 'Argon2'],
    answer: 1,
    explanation: 'MD5 is vulnerable to collision attacks and must never be used for security.'
  },
  {
    prompt: 'What principle ensures users only have the minimal access necessary to perform their work?',
    options: [
      'Separation of Duties',
      'Principle of Least Privilege',
      'Defense in Depth',
      'Non-repudiation'
    ],
    answer: 1,
    explanation: 'The Principle of Least Privilege limits damage if an account is breached.'
  },
  {
    prompt: 'Which sender domain below is an example of typosquatting / phishing?',
    options: [
      'accounts.google.com',
      'support@g00gle-security-alert.com',
      'mail.google.com',
      'admin.google.com'
    ],
    answer: 1,
    explanation: 'g00gle-security-alert.com uses zeros instead of "o"s to trick victims.'
  }
];

export default function PlacementQuizModal({ isOpen, onClose, onComplete }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = PLACEMENT_QUESTIONS[currentQIndex];

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQ.answer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQIndex < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    const passed = score >= 2;
    onComplete(passed, score);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/65 backdrop-blur-[2px]">
      <div
        className="w-full max-w-[460px] bg-surface-container-lowest rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-[slideUp_0.2s_ease-out]"
        role="dialog"
        aria-modal="true"
      >
        {!isFinished ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <span className="font-extrabold text-xs text-primary uppercase tracking-wider">
                Placement Diagnostic • Question {currentQIndex + 1} of {PLACEMENT_QUESTIONS.length}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Prompt */}
            <p className="font-extrabold text-base text-on-surface mt-1 leading-snug">
              {currentQ.prompt}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2.5 my-2">
              {currentQ.options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`option-card p-3 flex items-center justify-between ${
                    selectedAnswer === idx ? 'option-card-selected' : ''
                  }`}
                >
                  <span className="font-bold text-sm text-on-surface">{opt}</span>
                  <span className="material-symbols-outlined text-sm font-bold">
                    {selectedAnswer === idx ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`btn-tactile w-full py-3.5 text-sm uppercase ${
                selectedAnswer !== null ? 'btn-primary' : 'btn-disabled'
              }`}
              type="button"
            >
              Continue
            </button>
          </>
        ) : (
          /* Finished Screen */
          <div className="flex flex-col items-center text-center py-4">
            <Mascot state={score >= 2 ? 'cheer' : 'happy'} size={120} />
            <h3 className="text-xl font-black text-on-surface mt-3">
              {score >= 2 ? 'Great Diagnostic Score!' : 'Diagnostic Complete'}
            </h3>
            <p className="text-sm font-semibold text-on-surface-variant mt-1 max-w-xs">
              {score >= 2
                ? `You scored ${score}/3! You've unlocked fast progression and earned a +50 XP bonus.`
                : `You scored ${score}/3. Starting from Lesson 1 will help you build solid muscle memory!`}
            </p>
            <button
              onClick={handleFinish}
              className="btn-tactile btn-primary w-full py-3.5 text-sm uppercase mt-6"
              type="button"
            >
              Start Learning Path
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

PlacementQuizModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired
};
