/**
 * GuidebookModal Component
 * Full-fidelity concept notes and educational guidebook for a unit.
 */

import PropTypes from 'prop-types';

export default function GuidebookModal({ unit, isOpen, onClose }) {
  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-inverse-surface/60 backdrop-blur-[2px]">
      <div
        className="w-full max-w-[500px] max-h-[85vh] bg-surface-container-lowest rounded-t-[28px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guidebook-title"
      >
        {/* Header */}
        <div
          className="p-5 text-white flex items-center justify-between"
          style={{ backgroundColor: unit.color || '#58CC02' }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl">menu_book</span>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-white/80 block">
                Field Guidebook
              </span>
              <h2 id="guidebook-title" className="text-lg font-extrabold text-white leading-tight">
                {unit.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            type="button"
            aria-label="Close Guidebook"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-on-surface">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
            <h3 className="font-extrabold text-sm text-primary uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">lightbulb</span>
              Key Security Concept
            </h3>
            <p className="text-sm font-semibold text-on-surface-variant leading-relaxed">
              {unit.guidebook || 'Review concepts, formulas, and tactical threat vectors before attempting this unit.'}
            </p>
          </div>

          <div className="bg-secondary-fixed/20 p-4 rounded-xl border border-secondary/20">
            <h4 className="font-extrabold text-xs text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">verified</span>
              Cadet Briefing
            </h4>
            <ul className="text-xs font-semibold text-on-surface space-y-1.5 list-disc list-inside">
              <li>Read all threat indicators and sender domains thoroughly before tapping.</li>
              <li>Every wrong answer costs 1 heart; mistakes will re-queue at the end of the lesson.</li>
              <li>Complete all exercises with zero errors to earn the Perfect Lesson Gem Bonus!</li>
            </ul>
          </div>
        </div>

        {/* Bottom Close Button */}
        <div className="p-4 bg-surface border-t border-outline-variant/20">
          <button
            onClick={onClose}
            className="btn-tactile btn-primary w-full py-3 text-sm"
            type="button"
          >
            Got It, Let&apos;s Defend!
          </button>
        </div>
      </div>
    </div>
  );
}

GuidebookModal.propTypes = {
  unit: PropTypes.shape({
    title: PropTypes.string,
    color: PropTypes.string,
    guidebook: PropTypes.string
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

