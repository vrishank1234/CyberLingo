/**
 * MultipleChoice Exercise Component
 * Single option selection from 3-4 options with numbered pills and 3D tactile borders.
 */

import PropTypes from 'prop-types';

export default function MultipleChoice({
  exercise,
  answer,
  onAnswerChange,
  disabled = false,
  status = 'idle' // 'idle' | 'checking' | 'correct' | 'incorrect'
}) {
  return (
    <div className="flex flex-col gap-3 w-full my-4 select-none">
      {exercise.options?.map((option, idx) => {
        const isSelected = answer === idx;
        const isAnswerCorrect = status === 'correct' && isSelected;
        const isAnswerWrong = status === 'incorrect' && isSelected;

        let cardClass = 'bg-surface-container-lowest text-on-surface shadow-[0_4px_0_0_#dcd9d9]';
        let badgeClass = 'bg-surface-container text-on-surface-variant';
        let checkClass = 'bg-surface-container text-transparent';

        if (isSelected) {
          cardClass = 'bg-secondary-fixed/30 text-on-surface border-2 border-secondary shadow-[0_4px_0_0_#006590]';
          badgeClass = 'bg-secondary text-white';
          checkClass = 'bg-secondary text-white';
        }

        if (isAnswerCorrect) {
          cardClass = 'bg-[#D7FFB8] text-primary-shade border-2 border-primary-shade shadow-[0_4px_0_0_#46A302]';
          badgeClass = 'bg-primary-container text-white';
          checkClass = 'bg-primary-container text-white';
        } else if (isAnswerWrong) {
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
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <span className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm ${badgeClass}`}>
                {idx + 1}
              </span>
              <span className="font-extrabold text-sm sm:text-base leading-snug">
                {option}
              </span>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${checkClass}`}>
              <span className="material-symbols-outlined text-sm font-bold">
                {isAnswerWrong ? 'close' : 'check'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

MultipleChoice.propTypes = {
  exercise: PropTypes.shape({
    prompt: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  answer: PropTypes.number,
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};
