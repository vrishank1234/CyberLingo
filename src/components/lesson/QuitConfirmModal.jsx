/**
 * QuitConfirmModal Component
 * Confirmation dialog when cadet clicks 'X' to abandon a lesson mid-way.
 */

import PropTypes from 'prop-types';
import Mascot from '../ui/Mascot.jsx';

export default function QuitConfirmModal({ isOpen, onClose, onConfirmQuit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/65 backdrop-blur-[2px]">
      <div
        className="w-full max-w-[380px] bg-surface-container-lowest rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center animate-[slideUp_0.2s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quit-modal-title"
      >
        <div className="my-2">
          <Mascot state="sad" size={100} />
        </div>

        <h3 id="quit-modal-title" className="text-xl font-black text-on-surface mt-2">
          Abandon Mission?
        </h3>
        <p className="text-xs font-semibold text-on-surface-variant mt-1 mb-6">
          You are halfway through this cybersecurity drill. Quitting now will forfeit current progress.
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onClose}
            className="btn-tactile btn-primary w-full py-3.5 text-xs uppercase"
            type="button"
          >
            Keep Defending
          </button>
          <button
            onClick={onConfirmQuit}
            className="w-full py-2.5 text-xs font-extrabold text-error hover:bg-error-container/30 rounded-xl transition-colors uppercase tracking-wider"
            type="button"
          >
            End Lesson
          </button>
        </div>
      </div>
    </div>
  );
}

QuitConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirmQuit: PropTypes.func.isRequired
};

