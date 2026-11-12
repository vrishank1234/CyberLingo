/**
 * MatchPairs Exercise Component
 * Two-column matching game for cybersecurity terms and definitions.
 * Matches stitch_cyberlingo_mobile_app/lesson_match_pairs_exercise.
 */

import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export default function MatchPairs({
  exercise,
  answer = [],
  onAnswerChange,
  disabled = false,
  status: _status = 'idle'
}) {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const matchedPairs = Array.isArray(answer) ? answer : [];

  // Shuffle right side once per exercise
  const shuffledDefinitions = useMemo(() => {
    const defs = exercise.pairs?.map((p) => p[1]) || [];
    return [...defs].sort(() => 0.5 - Math.random());
  }, [exercise.pairs]);

  // Check if a term or definition is already matched
  const isTermMatched = (term) => matchedPairs.some(([t]) => t === term);
  const isDefMatched = (def) => matchedPairs.some(([, d]) => d === def);

  const handleTermClick = (term) => {
    if (disabled || isTermMatched(term)) return;
    setSelectedTerm(selectedTerm === term ? null : term);
  };

  const handleDefClick = (def) => {
    if (disabled || isDefMatched(def)) return;
    if (selectedTerm) {
      // Create new match pair
      const newMatches = [...matchedPairs, [selectedTerm, def]];
      onAnswerChange(newMatches);
      setSelectedTerm(null);
    }
  };

  const handleUnmatch = (pair) => {
    if (disabled) return;
    onAnswerChange(matchedPairs.filter(([t, d]) => !(t === pair[0] && d === pair[1])));
  };

  return (
    <div className="flex flex-col gap-4 w-full my-4 select-none">
      <span className="text-xs font-extrabold text-secondary tracking-wider uppercase flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">touch_app</span>
        Tap a term on the left, then its match on the right:
      </span>

      <div className="grid grid-cols-2 gap-3">
        {/* Left Column: Terms */}
        <div className="flex flex-col gap-2.5">
          {exercise.pairs?.map(([term], idx) => {
            const isMatched = isTermMatched(term);
            const isSelected = selectedTerm === term;
            const matchingPair = matchedPairs.find(([t]) => t === term);

            let btnClass = 'bg-surface-container-lowest text-on-surface shadow-[0_4px_0_0_#dcd9d9]';
            if (isSelected) {
              btnClass = 'bg-secondary-fixed text-on-secondary-fixed border-2 border-secondary shadow-[0_4px_0_0_#006590]';
            } else if (isMatched) {
              btnClass = 'bg-primary-fixed text-on-primary-fixed shadow-[0_4px_0_0_#6be026] opacity-90';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => (isMatched ? handleUnmatch(matchingPair) : handleTermClick(term))}
                className={`w-full text-left p-3.5 rounded-xl min-h-[72px] flex items-center justify-between transition-all active:translate-y-1 active:shadow-none cursor-pointer ${btnClass}`}
              >
                <span className={`font-extrabold text-sm ${isMatched ? 'line-through text-on-primary-fixed-variant' : ''}`}>
                  {term}
                </span>
                {isMatched && (
                  <span
                    className="material-symbols-outlined text-primary text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
                {isSelected && (
                  <span className="material-symbols-outlined text-secondary text-base">
                    touch_app
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Definitions */}
        <div className="flex flex-col gap-2.5">
          {shuffledDefinitions.map((def, idx) => {
            const isMatched = isDefMatched(def);
            const matchingPair = matchedPairs.find(([, d]) => d === def);

            let btnClass = 'bg-surface-container-lowest text-on-surface shadow-[0_4px_0_0_#dcd9d9]';
            if (isMatched) {
              btnClass = 'bg-primary-fixed text-on-primary-fixed shadow-[0_4px_0_0_#6be026] opacity-90';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => (isMatched ? handleUnmatch(matchingPair) : handleDefClick(def))}
                className={`w-full text-left p-3.5 rounded-xl min-h-[72px] flex items-center justify-between transition-all active:translate-y-1 active:shadow-none cursor-pointer ${btnClass}`}
              >
                <span className={`text-xs font-bold leading-tight ${isMatched ? 'line-through text-on-primary-fixed-variant' : ''}`}>
                  {def}
                </span>
                {isMatched && (
                  <span
                    className="material-symbols-outlined text-primary text-lg shrink-0 ml-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
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

MatchPairs.propTypes = {
  exercise: PropTypes.shape({
    prompt: PropTypes.string,
    pairs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired
  }).isRequired,
  answer: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};
