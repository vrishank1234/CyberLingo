/**
 * MultiSelect Exercise Component
 * Select all applicable options with checkboxes and tactile toggle cards.
 */

import PropTypes from 'prop-types';

export default function MultiSelect({
  exercise,
  answer = [],
  onAnswerChange,
  disabled = false,
  status = 'idle'
}) {
  const currentAnswers = Array.isArray(answer) ? answer : [];

  const handleToggle = (idx) => {
    if (disabled) return;
    if (currentAnswers.includes(idx)) {
      onAnswerChange(currentAnswers.filter((i) => i !== idx));
    } else {
      onAnswerChange([...currentAnswers, idx]);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full my-4 select-none">
      <span className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">checklist</span>
        Select all that apply:
      </span>

      {exercise.options?.map((option, idx) => {
        const isSelected = currentAnswers.includes(idx);
        const isAnswerCorrect = status === 'correct' && isSelected;
        const isAnswerWrong = status === 'incorrect' && isSelected;

        let cardClass = 'bg-surface-container-lowest text-on-surface shadow-[0_4px_0_0_#dcd9d9]';
        let boxClass = 'bg-surface-container border border-outline-variant/40 text-transparent';

        if (isSelected) {
          cardClass = 'bg-secondary-fixed/30 text-on-surface border-2 border-secondary shadow-[0_4px_0_0_#006590]';
          boxClass = 'bg-secondary text-white';
        }

        if (isAnswerCorrect) {
          cardClass = 'bg-[#D7FFB8] text-primary-shade border-2 border-primary-shade shadow-[0_4px_0_0_#46A302]';
          boxClass = 'bg-primary-container text-white';
        } else if (isAnswerWrong) {
          cardClass = 'bg-[#FFDFE0] text-error border-2 border-error shadow-[0_4px_0_0_#EA2B2B]';
          boxClass = 'bg-error text-white';
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => handleToggle(idx)}
            className={`w-full text-left rounded-2xl p-4 flex items-center justify-between transition-all active:translate-y-1 active:shadow-none cursor-pointer ${cardClass}`}
          >
            <span className="font-extrabold text-sm sm:text-base leading-snug pr-3">
              {option}
            </span>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${boxClass}`}>
              <span className="material-symbols-outlined text-sm font-bold">check</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

MultiSelect.propTypes = {
  exercise: PropTypes.shape({
    prompt: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  answer: PropTypes.arrayOf(PropTypes.number),
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};
