/**
 * StartLessonModal Component
 * Interactive modal that appears when a user clicks an active or completed lesson node on the path.
 * Shows lesson briefing, question count, XP rewards, and primary start CTA.
 */

import PropTypes from 'prop-types';
import Mascot from '../ui/Mascot.jsx';

export default function StartLessonModal({
  lesson,
  unit,
  isOpen,
  onClose,
  onStart,
  isCompleted
}) {
  if (!isOpen || !lesson) return null;

  const exerciseCount = lesson.exerciseCount || lesson.exercises?.length || 8;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-inverse-surface/60 backdrop-blur-[2px]">
      <div
        className="w-full max-w-[480px] bg-surface-container-lowest rounded-t-[28px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-modal-title"
      >
        {/* Top Drag Handle on Mobile */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-surface-container-highest rounded-full" />
        </div>

        <div className="flex flex-col p-6 gap-4">
          {/* Header Row: Unit Tag & Close */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-primary-container/20 text-primary px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span>{unit?.title || 'Cyber Mission'}</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
              type="button"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Mission Card: Mascot + Overview */}
          <div className="relative w-full rounded-2xl bg-secondary-fixed/20 p-4 flex items-center gap-4 border border-secondary/20">
            <Mascot state="happy" size={80} className="shrink-0" />
            <div className="flex flex-col min-w-0">
              <h2 id="lesson-modal-title" className="font-extrabold text-lg text-on-surface leading-tight">
                {lesson.title}
              </h2>
              <p className="text-xs font-semibold text-on-surface-variant mt-1 line-clamp-2">
                {isCompleted
                  ? 'Review this mission to reinforce muscle memory and earn practice XP.'
                  : 'Defeat threats, decode clues, and boost your streak in this mission.'}
              </p>
            </div>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center py-2.5 px-2 bg-surface-container rounded-xl shadow-[0_2px_0_0_#dcd9d9]">
              <div className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  quiz
                </span>
                <span className="font-extrabold text-sm text-on-surface">{exerciseCount}</span>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant mt-0.5">Exercises</span>
            </div>

            <div className="flex flex-col items-center justify-center py-2.5 px-2 bg-surface-container rounded-xl shadow-[0_2px_0_0_#dcd9d9]">
              <div className="flex items-center gap-1 text-tertiary-container">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
                <span className="font-extrabold text-sm text-on-surface">
                  {isCompleted ? '+5 XP' : '+10 XP'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant mt-0.5">Reward</span>
            </div>

            <div className="flex flex-col items-center justify-center py-2.5 px-2 bg-surface-container rounded-xl shadow-[0_2px_0_0_#dcd9d9]">
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-lg">timer</span>
                <span className="font-extrabold text-sm text-on-surface">~4m</span>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant mt-0.5">Estimate</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onStart(lesson);
              }}
              className="btn-tactile btn-primary w-full py-4 text-base tracking-wider uppercase flex items-center justify-center gap-2"
              type="button"
            >
              <span>{isCompleted ? 'Practice Mission' : 'Start Mission'}</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

StartLessonModal.propTypes = {
  lesson: PropTypes.object,
  unit: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool
};

