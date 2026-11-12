/**
 * LessonNode Component
 * Represents a circular 72px 3D tactile node on the winding Learn path.
 * States: 'completed' (gold crown/check), 'active' (pulsing, START bubble), 'locked' (padlock).
 */

import PropTypes from 'prop-types';
import Mascot from '../ui/Mascot.jsx';

export default function LessonNode({
  lesson,
  state = 'locked', // 'completed' | 'active' | 'locked'
  horizontalOffset = 0, // offset in px (-50 to +50)
  onClick
}) {
  const isCompleted = state === 'completed';
  const isActive = state === 'active';
  const isLocked = state === 'locked';

  return (
    <div
      className="relative z-10 my-4 flex flex-col items-center select-none"
      style={{
        transform: `translateX(${horizontalOffset}px)`,
        transition: 'transform 0.3s ease'
      }}
    >
      {/* COMPLETED ACCENT BADGE */}
      {isCompleted && (
        <div className="absolute -top-3.5 flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container shadow-[0_2px_0_0_#9a7800] z-20">
          <span
            className="material-symbols-outlined text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-tight">Done</span>
        </div>
      )}

      {/* ACTIVE "START" FLOATING BUBBLE TOOLTIP */}
      {isActive && (
        <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce pointer-events-none">
          <div className="bg-surface-container-lowest px-3.5 py-1.5 rounded-xl shadow-[0_4px_0_0_#CECECE] flex items-center gap-1 border border-outline-variant/30">
            <span className="font-extrabold text-xs text-primary-container tracking-wider">START</span>
            <span className="material-symbols-outlined text-primary-container text-sm font-bold">
              arrow_forward
            </span>
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-surface-container-lowest -mt-[1px]" />
        </div>
      )}

      {/* ACTIVE PULSING RINGS */}
      {isActive && (
        <>
          <div className="absolute -inset-3 rounded-full bg-primary-container/25 animate-ping pointer-events-none" />
          <div className="absolute -inset-1.5 rounded-full bg-primary-container/20 pointer-events-none" />
        </>
      )}

      {/* CIRCULAR 3D BUTTON */}
      <button
        onClick={() => !isLocked && onClick(lesson)}
        disabled={isLocked}
        aria-label={`${lesson.title} (${state})`}
        type="button"
        className={`relative z-20 w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all ${
          isCompleted
            ? 'bg-[#FFC800] text-white shadow-[0_6px_0_0_#DDA000] active:translate-y-1.5 active:shadow-none cursor-pointer'
            : isActive
              ? 'bg-primary-container text-white shadow-[0_6px_0_0_#46A302] active:translate-y-1.5 active:shadow-none cursor-pointer'
              : 'bg-surface-variant text-outline shadow-[0_6px_0_0_#c5c3c2] cursor-not-allowed opacity-90'
        }`}
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            isCompleted || isActive ? 'bg-white/25' : 'bg-black/5'
          }`}
        >
          {isCompleted ? (
            <span
              className="material-symbols-outlined text-3xl font-extrabold text-white"
              style={{ fontVariationSettings: "'wght' 700" }}
            >
              check
            </span>
          ) : isActive ? (
            <span
              className="material-symbols-outlined text-3xl font-extrabold text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield
            </span>
          ) : (
            <span className="material-symbols-outlined text-2xl font-bold text-outline">
              lock
            </span>
          )}
        </div>
      </button>

      {/* LESSON NODE TITLE */}
      <span
        className={`mt-2 font-extrabold text-xs text-center max-w-[110px] truncate ${
          isActive
            ? 'text-primary'
            : isCompleted
              ? 'text-on-surface'
              : 'text-outline'
        }`}
      >
        {lesson.title}
      </span>

      {/* OPTIONAL CHEERING SHIELDY COMPANION ON ACTIVE NODE */}
      {isActive && (
        <div className="absolute -right-28 top-0 hidden min-[400px]:flex items-center gap-1.5 pointer-events-none">
          <div className="bg-surface-container-lowest p-2 rounded-xl shadow-[0_3px_0_0_#CECECE] border border-outline-variant/30 max-w-[110px]">
            <p className="text-[10px] font-extrabold text-on-surface leading-tight">
              Ready, Cadet? Defend this node!
            </p>
          </div>
          <Mascot state="happy" size={50} />
        </div>
      )}
    </div>
  );
}

LessonNode.propTypes = {
  lesson: PropTypes.shape({
    lessonId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  state: PropTypes.oneOf(['completed', 'active', 'locked']),
  horizontalOffset: PropTypes.number,
  onClick: PropTypes.func.isRequired
};

