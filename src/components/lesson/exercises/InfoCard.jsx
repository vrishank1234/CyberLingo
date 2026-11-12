/**
 * InfoCard Exercise Component
 * Concept teaching card shown before a new topic.
 * Matches stitch_cyberlingo_mobile_app 2/lesson_info_card.
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Mascot from '../../ui/Mascot.jsx';

export default function InfoCard({
  exercise,
  onAnswerChange,
  disabled: _disabled = false,
  status: _status = 'idle'
}) {
  // Teaching card requires no user input; enable check/continue immediately
  useEffect(() => {
    onAnswerChange(true);
  }, [onAnswerChange]);

  return (
    <div className="flex flex-col items-center text-center w-full my-4 select-none">
      {/* Hero Concept Box */}
      <div className="w-full p-5 rounded-2xl bg-surface-container-lowest shadow-[0_4px_0_0_#dcd9d9] border border-outline-variant/30 flex flex-col items-center">
        {/* Glow Illustration Container */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-3">
          <div className="absolute inset-0 rounded-full bg-secondary-fixed/40 animate-pulse" />
          <Mascot state="happy" size={100} />
        </div>

        {/* Title */}
        <span className="text-xs font-black text-secondary uppercase tracking-wider mb-1">
          New Concept Unlocked
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mb-2">
          {exercise.title}
        </h2>

        {/* Content Body */}
        <p className="text-sm font-semibold text-on-surface-variant leading-relaxed max-w-sm">
          {exercise.content}
        </p>

        {/* Key Takeaway Callout */}
        {exercise.keyTakeaway && (
          <div className="w-full mt-4 p-3.5 rounded-xl bg-surface-container-low text-left border border-outline-variant/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-2xl shrink-0 mt-0.5">
              lightbulb
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase text-secondary tracking-wide">
                Tactical Rule
              </span>
              <p className="text-xs font-bold text-on-surface leading-snug mt-0.5">
                {exercise.keyTakeaway}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

InfoCard.propTypes = {
  exercise: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    keyTakeaway: PropTypes.string
  }).isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};

