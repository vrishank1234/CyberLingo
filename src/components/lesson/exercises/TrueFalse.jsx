/**
 * TrueFalse Exercise Component
 * Binary statement judgement with prominent True and False tactile tiles.
 */

import PropTypes from 'prop-types';

export default function TrueFalse({
  exercise: _exercise,
  answer,
  onAnswerChange,
  disabled = false,
  status = 'idle'
}) {
  const options = [
    { value: true, label: 'True', icon: 'check_circle', color: 'primary' },
    { value: false, label: 'False', icon: 'cancel', color: 'error' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full my-6 select-none">
      {options.map((opt) => {
        const isSelected = answer === opt.value;
        const isAnswerCorrect = status === 'correct' && isSelected;
        const isAnswerWrong = status === 'incorrect' && isSelected;

        let cardClass = 'bg-surface-container-lowest text-on-surface shadow-[0_5px_0_0_#dcd9d9]';

        if (isSelected) {
          cardClass = 'bg-secondary-fixed/40 text-secondary border-2 border-secondary shadow-[0_5px_0_0_#006590]';
        }

        if (isAnswerCorrect) {
          cardClass = 'bg-[#D7FFB8] text-primary-shade border-2 border-primary-shade shadow-[0_5px_0_0_#46A302]';
        } else if (isAnswerWrong) {
          cardClass = 'bg-[#FFDFE0] text-error border-2 border-error shadow-[0_5px_0_0_#EA2B2B]';
        }

        return (
          <button
            key={String(opt.value)}
            type="button"
            disabled={disabled}
            onClick={() => onAnswerChange(opt.value)}
            className={`py-8 px-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:translate-y-1 active:shadow-none cursor-pointer ${cardClass}`}
          >
            <span className="material-symbols-outlined text-4xl">{opt.icon}</span>
            <span className="font-extrabold text-lg uppercase tracking-wider">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

TrueFalse.propTypes = {
  exercise: PropTypes.shape({
    prompt: PropTypes.string.isRequired
  }).isRequired,
  answer: PropTypes.bool,
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};
