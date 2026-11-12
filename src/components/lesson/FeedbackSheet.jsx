/**
 * FeedbackSheet Component
 * Duolingo bottom slide-up drawer for correct/incorrect results.
 * Matches stitch_cyberlingo_mobile_app/lesson_correct_answer_feedback
 * and stitch_cyberlingo_mobile_app/lesson_incorrect_answer_feedback.
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function FeedbackSheet({
  isCorrect,
  correctAnswer,
  explanation,
  onContinue
}) {
  // Listen for 'Enter' key to advance
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  return (
    <aside
      className={`fixed bottom-0 inset-x-0 z-40 pb-safe pt-4 px-4 transition-all duration-300 animate-[slideUp_0.25s_cubic-bezier(0.16,1,0.3,1)] select-none ${
        isCorrect
          ? 'bg-[#D7FFB8] text-[#1E5000] border-t-2 border-[#46A302]'
          : 'bg-[#FFDFE0] text-[#7A000A] border-t-2 border-[#EA2B2B]'
      }`}
      aria-live="polite"
    >
      <div className="max-w-[480px] mx-auto flex flex-col gap-3 py-2">
        {/* Feedback Header: Status Icon + Message */}
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              isCorrect ? 'bg-primary-container text-white' : 'bg-error text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl font-black"
              style={{ fontVariationSettings: "'wght' 700" }}
            >
              {isCorrect ? 'check' : 'close'}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="font-black text-lg sm:text-xl leading-tight">
              {isCorrect ? 'Nicely defended!' : 'Threat breached!'}
            </h3>

            {!isCorrect && correctAnswer && (
              <p className="text-xs sm:text-sm font-extrabold mt-0.5">
                Correct solution: <span className="underline">{correctAnswer}</span>
              </p>
            )}

            {explanation && (
              <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1 leading-snug">
                {explanation}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onContinue}
            className={`btn-tactile w-full py-4 text-base tracking-wider uppercase flex items-center justify-center gap-2 ${
              isCorrect ? 'btn-primary' : 'btn-danger'
            }`}
            type="button"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

FeedbackSheet.propTypes = {
  isCorrect: PropTypes.bool.isRequired,
  correctAnswer: PropTypes.string,
  explanation: PropTypes.string,
  onContinue: PropTypes.func.isRequired
};
