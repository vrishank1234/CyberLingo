/**
 * LessonComplete Component
 * Victory celebration screen with animated confetti, XP earned, accuracy %,
 * duration, gem reward, and streak update.
 * Matches stitch_cyberlingo_mobile_app/lesson_complete_celebration.
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import confetti from 'canvas-confetti';
import Mascot from '../ui/Mascot.jsx';
import { useUserStore } from '../../store/userStore.js';

export default function LessonComplete({
  lesson,
  unit,
  accuracyPercent = 100,
  durationSeconds = 60,
  isPerfect = false,
  onContinue
}) {
  const { streak, addXp, addGems, markLessonCompleted } = useUserStore();

  const xpReward = isPerfect ? 15 : 10;
  const gemReward = isPerfect ? 20 : 10;

  // Trigger confetti burst on celebration screen mount & award client rewards
  useEffect(() => {
    // Award client-side progress rewards
    addXp(xpReward);
    addGems(gemReward);
    if (lesson?.lessonId) {
      markLessonCompleted(lesson.lessonId);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Fallback if canvas is unavailable
    }
  }, [addXp, addGems, markLessonCompleted, lesson?.lessonId, xpReward, gemReward]);

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="flex flex-col w-full max-w-[480px] mx-auto min-h-[92vh] justify-between p-4 select-none">
      <div className="flex flex-col items-center text-center my-auto">
        {/* Night-Mode Cyber Victory Card */}
        <div className="relative w-full rounded-2xl bg-[#131F24] text-slate-100 p-6 shadow-2xl flex flex-col items-center overflow-hidden border border-slate-800">
          {/* Subtle Ambient Glow Behind Mascot */}
          <div className="absolute -top-12 inset-x-0 h-44 bg-gradient-to-b from-primary-container/30 to-transparent blur-xl pointer-events-none" />

          {/* Celebratory Shieldy */}
          <div className="relative my-2">
            <Mascot state="cheer" size={150} />
            {isPerfect && (
              <div className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-black text-xs uppercase shadow-md animate-bounce">
                ★ Perfect Mission
              </div>
            )}
          </div>

          {unit?.title && (
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary mt-1">
              {unit.title}
            </p>
          )}

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3">
            Mission Complete!
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-400 mt-1">
            You defended {lesson?.title || 'the network node'}!
          </p>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-3 gap-2.5 w-full mt-6">
            {/* XP Tile */}
            <div className="p-3 bg-slate-800/80 rounded-xl flex flex-col items-center justify-center border border-slate-700">
              <span className="material-symbols-outlined text-tertiary-fixed text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <span className="font-black text-base text-white mt-0.5">+{xpReward} XP</span>
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Earned</span>
            </div>

            {/* Accuracy Tile */}
            <div className="p-3 bg-slate-800/80 rounded-xl flex flex-col items-center justify-center border border-slate-700">
              <span className="material-symbols-outlined text-primary-fixed text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span className="font-black text-base text-white mt-0.5">{accuracyPercent}%</span>
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Accuracy</span>
            </div>

            {/* Time Tile */}
            <div className="p-3 bg-slate-800/80 rounded-xl flex flex-col items-center justify-center border border-slate-700">
              <span className="material-symbols-outlined text-secondary-fixed text-xl">
                timer
              </span>
              <span className="font-black text-base text-white mt-0.5">{timeFormatted}</span>
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Duration</span>
            </div>
          </div>

          {/* Rewards Banner */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1CB0F6] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                diamond
              </span>
              <span className="font-extrabold text-xs text-slate-200">Gems Bonus</span>
            </div>
            <span className="font-black text-sm text-[#1CB0F6]">+{gemReward} Gems</span>
          </div>
        </div>

        {/* Streak Update Ribbon */}
        <div className="w-full mt-4 p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#FF9600] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xs text-on-surface">Daily Streak Extended</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">Keep it burning tomorrow!</span>
            </div>
          </div>
          <span className="font-black text-base text-[#FF9600]">{streak} Days</span>
        </div>
      </div>

      {/* Pinned Bottom Continue Button */}
      <div className="w-full pt-4">
        <button
          onClick={onContinue}
          className="btn-tactile btn-primary w-full py-4 text-base tracking-wider uppercase flex items-center justify-center gap-2"
          type="button"
        >
          <span>Continue</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

LessonComplete.propTypes = {
  lesson: PropTypes.object,
  unit: PropTypes.object,
  accuracyPercent: PropTypes.number,
  durationSeconds: PropTypes.number,
  isPerfect: PropTypes.bool,
  onContinue: PropTypes.func.isRequired
};
