/**
 * OrderSteps Exercise Component
 * Arrange procedural incident response steps in chronological sequence.
 * Matches stitch_cyberlingo_mobile_app/lesson_incident_response_step_ordering.
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';

export default function OrderSteps({
  exercise,
  answer = [],
  onAnswerChange,
  disabled = false,
  status: _status = 'idle'
}) {
  const currentOrdered = Array.isArray(answer) ? answer : [];

  // Shuffle initial pool once on mount
  const initialPool = useMemo(() => {
    return [...(exercise.steps || [])].sort(() => 0.5 - Math.random());
  }, [exercise.steps]);

  // Track remaining pool items not yet placed
  const availableTiles = initialPool.filter((step) => !currentOrdered.includes(step));

  const handleAddTile = (step) => {
    if (disabled) return;
    onAnswerChange([...currentOrdered, step]);
  };

  const handleRemoveTile = (step) => {
    if (disabled) return;
    onAnswerChange(currentOrdered.filter((s) => s !== step));
  };

  return (
    <div className="flex flex-col gap-5 w-full my-4 select-none">
      <span className="text-xs font-extrabold text-secondary tracking-wider uppercase flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">low_priority</span>
        Tap tiles to place in chronological sequence:
      </span>

      {/* Ordered Target Slots */}
      <div className="flex flex-col gap-2.5">
        {exercise.steps?.map((_, slotIdx) => {
          const placedStep = currentOrdered[slotIdx];

          return (
            <div
              key={slotIdx}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-container-lowest shadow-[0_3px_0_0_#dcd9d9] border border-outline-variant/30"
            >
              <div className="w-8 h-8 rounded-xl bg-surface-container text-on-surface font-extrabold text-xs flex items-center justify-center shrink-0">
                {slotIdx + 1}
              </div>

              {placedStep ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRemoveTile(placedStep)}
                  className="flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed shadow-[0_3px_0_0_#006590] active:translate-y-0.5 transition-transform cursor-pointer"
                >
                  <span className="font-extrabold text-sm leading-tight text-left">
                    {placedStep}
                  </span>
                  <span className="material-symbols-outlined text-xs bg-secondary text-white rounded-full p-0.5 ml-2 shrink-0">
                    close
                  </span>
                </button>
              ) : (
                <div className="flex-1 h-10 border-2 border-dashed border-outline-variant/40 rounded-xl bg-surface-container-low flex items-center px-3">
                  <span className="text-xs text-outline font-semibold">Slot {slotIdx + 1} Empty</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Available Tiles Bank */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider block">
          Available Steps:
        </span>
        <div className="flex flex-wrap gap-2">
          {availableTiles.map((step, idx) => (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => handleAddTile(step)}
              className="px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-surface-container-lowest text-on-surface shadow-[0_3px_0_0_#dcd9d9] hover:bg-surface-container-low active:translate-y-1 active:shadow-none cursor-pointer border border-outline-variant/20"
            >
              {step}
            </button>
          ))}
          {availableTiles.length === 0 && (
            <span className="text-xs text-outline font-semibold italic">
              All steps positioned. Tap Check below!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

OrderSteps.propTypes = {
  exercise: PropTypes.shape({
    prompt: PropTypes.string,
    steps: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  answer: PropTypes.arrayOf(PropTypes.string),
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};
