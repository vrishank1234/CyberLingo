/**
 * FillBlank Exercise Component
 * Sentence with blank slot + word bank chips.
 * Matches stitch_cyberlingo_mobile_app 2/lesson_fill_in_the_blank_exercise.
 */

import PropTypes from 'prop-types';

export default function FillBlank({
  exercise,
  answer = [],
  onAnswerChange,
  disabled = false,
  status: _status = 'idle'
}) {
  const currentTokens = Array.isArray(answer) ? answer : [];
  const selectedWord = currentTokens[0] || null;

  // Split sentence around '___'
  const parts = exercise.sentence.split('___');

  const handleSelectWord = (word) => {
    if (disabled) return;
    onAnswerChange([word]);
  };

  const handleClearSlot = () => {
    if (disabled) return;
    onAnswerChange([]);
  };

  return (
    <div className="flex flex-col gap-5 w-full my-4 select-none">
      {/* Sentence Display Card */}
      <div className="relative bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_0_0_#dcd9d9] border border-outline-variant/30">
        <div className="text-base sm:text-lg text-on-surface font-extrabold leading-relaxed flex flex-wrap items-center gap-2">
          <span>{parts[0]}</span>

          {/* Blank Slot or Populated Token */}
          {selectedWord ? (
            <button
              type="button"
              disabled={disabled}
              onClick={handleClearSlot}
              className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-3.5 py-1.5 rounded-xl font-extrabold text-sm shadow-[0_3px_0_0_#006590] active:translate-y-0.5 transition-all cursor-pointer animate-[pulse_1s_ease-out]"
            >
              <span className="material-symbols-outlined text-base text-secondary">vpn_key</span>
              <span>{selectedWord}</span>
              <span className="material-symbols-outlined text-xs bg-secondary text-white rounded-full p-0.5 ml-0.5">
                close
              </span>
            </button>
          ) : (
            <span className="inline-block min-w-[90px] h-9 border-2 border-dashed border-secondary/60 rounded-xl bg-secondary-fixed/15 animate-pulse" />
          )}

          <span>{parts[1]}</span>
        </div>
      </div>

      {/* Word Bank Selection Grid */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider block">
          Tap word to complete sentence:
        </span>
        <div className="grid grid-cols-2 gap-3">
          {exercise.wordBank?.map((word, idx) => {
            const isUsed = selectedWord === word;
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || isUsed}
                onClick={() => handleSelectWord(word)}
                className={`flex items-center justify-center p-4 rounded-xl font-extrabold text-sm sm:text-base transition-all ${
                  isUsed
                    ? 'bg-surface-container-high text-outline shadow-[0_2px_0_0_#dcd9d9] opacity-50 cursor-not-allowed'
                    : 'bg-surface-container-lowest text-on-surface shadow-[0_4px_0_0_#dcd9d9] hover:bg-surface-container-low active:translate-y-1 active:shadow-none cursor-pointer'
                }`}
              >
                <span>{word}</span>
                {isUsed && (
                  <span className="material-symbols-outlined text-xs text-outline ml-1">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

FillBlank.propTypes = {
  exercise: PropTypes.shape({
    prompt: PropTypes.string,
    sentence: PropTypes.string.isRequired,
    wordBank: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  answer: PropTypes.arrayOf(PropTypes.string),
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};
