/**
 * OutOfHeartsModal Component
 * Shows downcast Shieldy mascot when hearts are empty or inspected.
 * Options: Practice for a heart, Refill with gems (350 gems), or wait for regeneration.
 */

import PropTypes from 'prop-types';
import { useUserStore } from '../../store/userStore.js';
import Mascot from '../ui/Mascot.jsx';

export default function OutOfHeartsModal({ isOpen, onClose, onPracticeClick }) {
  const { gems, spendGems, refillHearts, getEffectiveHearts } = useUserStore();
  const { currentHearts, nextHeartAt } = getEffectiveHearts();

  if (!isOpen) return null;

  const REFILL_COST = 350;
  const canAfford = gems >= REFILL_COST;

  const minutesRemaining = nextHeartAt
    ? Math.max(1, Math.round((nextHeartAt - Date.now()) / 60000))
    : 0;

  const handleRefill = () => {
    if (spendGems(REFILL_COST)) {
      refillHearts();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-inverse-surface/65 backdrop-blur-[2px]">
      <div
        className="w-full max-w-[480px] bg-surface-container-lowest rounded-t-[28px] sm:rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center animate-[slideUp_0.25s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hearts-modal-title"
      >
        {/* Top Handle on Mobile */}
        <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mb-3 sm:hidden" />

        {/* Mascot & Broken Heart Header */}
        <div className="relative my-2">
          <Mascot state="sad" size={130} />
          {currentHearts === 0 && (
            <div className="absolute -top-1 -right-2 p-2 rounded-full bg-error-container text-error shadow-sm animate-pulse">
              <span
                className="material-symbols-outlined text-3xl block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                heart_broken
              </span>
            </div>
          )}
        </div>

        {/* Title & Status */}
        <h2 id="hearts-modal-title" className="text-2xl font-extrabold text-on-surface tracking-tight mt-1">
          {currentHearts === 0 ? 'You ran out of hearts!' : `${currentHearts} / 5 Hearts Available`}
        </h2>
        <p className="text-sm font-semibold text-on-surface-variant max-w-xs mt-1">
          {currentHearts < 5
            ? `Next heart regenerates in approximately ${minutesRemaining} minutes.`
            : 'Your shields are fully charged. You are ready for lessons!'}
        </p>

        {/* Action Options */}
        <div className="w-full flex flex-col gap-3 mt-6">
          {/* Option 1: Practice Drill */}
          <button
            onClick={() => {
              onClose();
              if (onPracticeClick) onPracticeClick();
            }}
            className="btn-tactile btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">fitness_center</span>
            <span>Practice Defense (+1 Heart)</span>
          </button>

          {/* Option 2: Refill with Gems */}
          <button
            onClick={handleRefill}
            disabled={!canAfford}
            className={`btn-tactile w-full py-3.5 text-sm flex items-center justify-center gap-2 ${
              canAfford ? 'btn-secondary' : 'btn-disabled'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              diamond
            </span>
            <span>Refill Hearts ({REFILL_COST} Gems)</span>
          </button>

          {/* Option 3: Dismiss */}
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-extrabold text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-wider mt-1"
            type="button"
          >
            Wait for Recharge
          </button>
        </div>
      </div>
    </div>
  );
}

OutOfHeartsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPracticeClick: PropTypes.func
};

