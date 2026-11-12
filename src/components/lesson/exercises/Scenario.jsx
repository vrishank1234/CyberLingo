/**
 * Scenario Exercise Component
 * Real-world incident narrative with tactical choices.
 * Matches stitch_cyberlingo_mobile_app 2/lesson_scenario_challenge.
 */

import PropTypes from 'prop-types';

export default function Scenario({
  exercise,
  answer,
  onAnswerChange,
  disabled = false,
  status = 'idle'
}) {
  return (
    <div className="flex flex-col gap-4 w-full my-4 select-none">
      {/* Scenario Narrative Simulation Card */}
      <div className="relative bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_0_0_#dcd9d9] border border-outline-variant/30">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error" />
            </span>
            <span className="font-extrabold text-xs text-error uppercase tracking-wider">
              Incident Alert
            </span>
          </div>
          <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">schedule</span>
            Simulated
          </span>
        </div>

        <p className="text-sm font-semibold text-on-surface leading-relaxed">
          {exercise.context}
        </p>
      </div>

      {/* Question Prompt */}
      <p className="font-extrabold text-sm text-secondary uppercase tracking-wider">
        {exercise.prompt}
      </p>

      {/* Options Stack */}
      <div className="flex flex-col gap-3">
        {exercise.options?.map((option, idx) => {
          const isSelected = answer === idx;
          const letter = String.fromCharCode(65 + idx);

          let cardClass = 'bg-surface-container-lowest text-on-surface shadow-[0_4px_0_0_#dcd9d9]';
          let badgeClass = 'bg-surface-container text-on-surface-variant';
          let checkClass = 'bg-surface-container text-transparent';

          if (isSelected) {
            cardClass = 'bg-secondary-fixed/30 text-on-surface border-2 border-secondary shadow-[0_4px_0_0_#006590]';
            badgeClass = 'bg-secondary text-white';
            checkClass = 'bg-secondary text-white';
          }

          if (status === 'correct' && isSelected) {
            cardClass = 'bg-[#D7FFB8] text-primary-shade border-2 border-primary-shade shadow-[0_4px_0_0_#46A302]';
            badgeClass = 'bg-primary-container text-white';
            checkClass = 'bg-primary-container text-white';
          } else if (status === 'incorrect' && isSelected) {
            cardClass = 'bg-[#FFDFE0] text-error border-2 border-error shadow-[0_4px_0_0_#EA2B2B]';
            badgeClass = 'bg-error text-white';
            checkClass = 'bg-error text-white';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onAnswerChange(idx)}
              className={`w-full text-left rounded-2xl p-4 flex items-center justify-between transition-all active:translate-y-1 active:shadow-none cursor-pointer ${cardClass}`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm ${badgeClass}`}>
                  {letter}
                </span>
                <span className="font-extrabold text-sm leading-snug">
                  {option}
                </span>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${checkClass}`}>
                <span className="material-symbols-outlined text-sm font-bold">check</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

Scenario.propTypes = {
  exercise: PropTypes.shape({
    context: PropTypes.string.isRequired,
    prompt: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  answer: PropTypes.number,
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};
