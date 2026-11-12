/**
 * TopBar Component
 * Header displaying brand, streak flame, gem count, lazy-computed hearts, and profile avatar.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useUserStore } from '../../store/userStore.js';
import OutOfHeartsModal from '../modals/OutOfHeartsModal.jsx';

export default function TopBar({ onProfileClick }) {
  const { streak, gems, user, getEffectiveHearts } = useUserStore();
  const { currentHearts, nextHeartAt } = getEffectiveHearts();
  const [showHeartsModal, setShowHeartsModal] = useState(false);

  // Calculate minutes to next heart
  const minutesToNext = nextHeartAt
    ? Math.max(1, Math.round((nextHeartAt - Date.now()) / 60000))
    : null;

  return (
    <>
      <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
        <div className="h-16 max-w-[480px] md:max-w-[640px] mx-auto px-4 flex items-center justify-between gap-2">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center text-white shadow-btn-primary-sm">
              <span className="material-symbols-outlined text-xl">security</span>
            </div>
            <span className="font-extrabold text-lg text-primary tracking-tight hidden min-[360px]:inline">
              CyberLingo
            </span>
          </div>

          {/* Gamification Stats Strip */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-low border border-neutral-200/60 shadow-sm cursor-default"
              title="Daily Streak"
            >
              <span
                className="material-symbols-outlined text-[#FF9600] text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="font-extrabold text-sm text-on-surface">{streak}</span>
            </div>

            {/* Gems Pill */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-low border border-neutral-200/60 shadow-sm cursor-default"
              title="Gems Balance"
            >
              <span
                className="material-symbols-outlined text-[#1CB0F6] text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                diamond
              </span>
              <span className="font-extrabold text-sm text-on-surface">{gems}</span>
            </div>

            {/* Hearts Life Counter */}
            <button
              onClick={() => setShowHeartsModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-low border border-neutral-200/60 shadow-sm hover:bg-surface-container transition-all cursor-pointer active:scale-95"
              title={minutesToNext ? `Regenerates in ${minutesToNext}m` : 'Hearts full (5/5)'}
              type="button"
            >
              <span
                className="material-symbols-outlined text-[#FF4B4B] text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <span className="font-extrabold text-sm text-on-surface">{currentHearts}</span>
            </button>
          </div>

          {/* User Profile / Upgrade Avatar */}
          <button
            onClick={onProfileClick}
            className="flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-primary-container/40 overflow-hidden bg-surface-container hover:ring-primary-container transition-all cursor-pointer"
            type="button"
            aria-label="View Profile"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-lg text-primary">person</span>
            )}
          </button>
        </div>
      </header>

      {/* Hearts Info / Refill Modal */}
      {showHeartsModal && (
        <OutOfHeartsModal
          isOpen={showHeartsModal}
          onClose={() => setShowHeartsModal(false)}
        />
      )}
    </>
  );
}

TopBar.propTypes = {
  onProfileClick: PropTypes.func
};

