/**
 * CommandComplete Exercise Component
 * Terminal CLI construction exercise matching stitch_cyberlingo_mobile_app/lesson_terminal_command_complete.
 */

import PropTypes from 'prop-types';

export default function CommandComplete({
  exercise,
  answer = [],
  onAnswerChange,
  disabled = false,
  status: _status = 'idle'
}) {
  const currentTokens = Array.isArray(answer) ? answer : [];

  const handleAddToken = (token) => {
    if (disabled) return;
    onAnswerChange([...currentTokens, token]);
  };

  const handleRemoveToken = (idx) => {
    if (disabled) return;
    const updated = [...currentTokens];
    updated.splice(idx, 1);
    onAnswerChange(updated);
  };

  return (
    <div className="flex flex-col gap-4 w-full my-4 select-none">
      {/* Terminal Window Container */}
      <div className="bg-[#131F24] rounded-2xl p-4 text-slate-100 shadow-[0_6px_0_0_#0a1013] overflow-hidden">
        {/* Terminal Window Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/60">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block shadow-sm" />
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-tight flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">terminal</span>
            cadet@cyberlingo-shell:~
          </span>
          <div className="w-10" />
        </div>

        {/* Terminal Prompt Body */}
        <div className="font-mono text-sm flex flex-col gap-2">
          <div className="text-emerald-400/80 flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-mono">#</span>
            <span>Target: {exercise.prompt}</span>
          </div>

          <div className="flex items-center flex-wrap gap-2 pt-1 font-mono text-sm sm:text-base">
            <span className="text-emerald-400 font-bold">$</span>

            {/* Assembled Tokens Slot */}
            {currentTokens.map((token, idx) => (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => handleRemoveToken(idx)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a2d36] text-[#2fb8ff] font-bold border border-[#2fb8ff]/60 active:scale-95 transition-transform cursor-pointer"
              >
                <span>{token}</span>
                <span className="material-symbols-outlined text-xs bg-secondary text-white rounded-full p-0.5">
                  close
                </span>
              </button>
            ))}

            {currentTokens.length === 0 && (
              <span className="text-slate-500 italic text-xs">
                [tap command tokens below to assemble]
              </span>
            )}

            <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5" />
          </div>
        </div>
      </div>

      {/* Word Bank of Command Tokens */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider block">
          Available Command Flags & Tokens:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {exercise.wordBank?.map((token, idx) => {
            const countUsed = currentTokens.filter((t) => t === token).length;
            const isUsed = countUsed >= 1;

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || isUsed}
                onClick={() => handleAddToken(token)}
                className={`p-3 rounded-xl font-mono font-bold text-sm transition-all ${
                  isUsed
                    ? 'bg-surface-container-high text-outline shadow-[0_2px_0_0_#dcd9d9] opacity-50 cursor-not-allowed'
                    : 'bg-surface-container-lowest text-on-surface shadow-[0_4px_0_0_#dcd9d9] hover:bg-surface-container-low active:translate-y-1 active:shadow-none cursor-pointer border border-outline-variant/30'
                }`}
              >
                {token}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

CommandComplete.propTypes = {
  exercise: PropTypes.shape({
    prompt: PropTypes.string.isRequired,
    targetCommand: PropTypes.string,
    wordBank: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  answer: PropTypes.arrayOf(PropTypes.string),
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};
