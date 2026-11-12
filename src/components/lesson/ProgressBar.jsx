/**
 * Lesson ProgressBar Component
 * Top header showing exit 'X' button, animated progress bar, and heart count.
 */

import PropTypes from 'prop-types';

export default function ProgressBar({
  progressPercent = 0,
  hearts = 5,
  onQuit
}) {
  return (
    <header className="w-full flex items-center justify-between gap-3 pt-2 pb-4 select-none">
      {/* Quit X Button */}
      <button
        onClick={onQuit}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high transition-transform active:scale-95 text-on-surface-variant cursor-pointer"
        type="button"
        aria-label="Exit Lesson"
      >
        <span className="material-symbols-outlined text-2xl font-bold">close</span>
      </button>

      {/* Animated Green Progress Bar */}
      <div
        className="flex-1 h-3.5 bg-surface-container-highest rounded-full overflow-hidden p-0.5 shadow-inner"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-primary-container rounded-full transition-all duration-500 ease-out shadow-[0_2px_0_0_#46A302]"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      {/* Hearts Counter */}
      <div className="flex items-center gap-1 px-3 py-1 bg-surface-container-low rounded-xl border border-neutral-200/50 shadow-sm">
        <span
          className="material-symbols-outlined text-[#FF4B4B] text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
        <span className="font-extrabold text-xs text-[#FF4B4B]">{hearts}</span>
      </div>
    </header>
  );
}

ProgressBar.propTypes = {
  progressPercent: PropTypes.number.isRequired,
  hearts: PropTypes.number.isRequired,
  onQuit: PropTypes.func.isRequired
};

