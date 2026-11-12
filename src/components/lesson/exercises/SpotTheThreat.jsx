/**
 * SpotTheThreat Exercise Component
 * Interactive visual inspection of emails, headers, or logs to tap suspicious elements.
 * Matches stitch_cyberlingo_mobile_app 2/lesson_spot_the_phish_email_challenge.
 */

import PropTypes from 'prop-types';

export default function SpotTheThreat({
  exercise,
  answer,
  onAnswerChange,
  disabled = false,
  status = 'idle'
}) {
  const threatData = exercise.threatData || {};
  const targets = threatData.targets || [];

  return (
    <div className="flex flex-col gap-4 w-full my-4 select-none">
      <span className="text-xs font-extrabold text-secondary tracking-wider uppercase flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">radar</span>
        Tap the suspicious indicator or red flag:
      </span>

      {/* Simulated Email / Message Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_5px_0_0_#dcd9d9] p-4 flex flex-col gap-3.5 border border-outline-variant/30">
        {/* Mock Window Top Bar */}
        <div className="flex items-center justify-between pb-2 bg-surface-container-low px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-error" />
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
          </div>
          <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            Inspection Sandbox
          </span>
        </div>

        {/* Sender Info Area */}
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold text-on-surface-variant">
            From: <strong className="text-on-surface">{threatData.senderDisplay || 'Unknown Sender'}</strong>
          </span>
          <span className="text-xs font-bold text-on-surface-variant">
            Subject: <strong className="text-on-surface">{threatData.subject || 'Security Notification'}</strong>
          </span>
        </div>

        {/* Message Body Snippet */}
        {threatData.body && (
          <div className="bg-surface-container-low p-3 rounded-xl text-xs font-semibold text-on-surface leading-relaxed">
            {threatData.body}
          </div>
        )}

        {/* Tappable Targets List */}
        <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/30">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-outline">
            Audit Targets:
          </span>

          {targets.map((target) => {
            const isSelected = answer === target.id;
            const isCorrect = status === 'correct' && isSelected;
            const isWrong = status === 'incorrect' && isSelected;

            let targetClass = 'bg-surface-container-low text-on-surface shadow-[0_3px_0_0_#eae8e7] border border-outline-variant/20';

            if (isSelected) {
              targetClass = 'bg-secondary-fixed/40 text-secondary border-2 border-secondary shadow-[0_3px_0_0_#006590]';
            }

            if (isCorrect) {
              targetClass = 'bg-[#D7FFB8] text-primary-shade border-2 border-primary-shade shadow-[0_3px_0_0_#46A302]';
            } else if (isWrong) {
              targetClass = 'bg-[#FFDFE0] text-error border-2 border-error shadow-[0_3px_0_0_#EA2B2B]';
            }

            return (
              <button
                key={target.id}
                type="button"
                disabled={disabled}
                onClick={() => onAnswerChange(target.id)}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all active:translate-y-0.5 cursor-pointer ${targetClass}`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="material-symbols-outlined text-base text-error">flag</span>
                  <span className="font-mono text-xs sm:text-sm font-bold truncate">
                    {target.text}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-secondary text-white shrink-0">
                    Flagged
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

SpotTheThreat.propTypes = {
  exercise: PropTypes.shape({
    prompt: PropTypes.string,
    threatData: PropTypes.shape({
      senderDisplay: PropTypes.string,
      subject: PropTypes.string,
      body: PropTypes.string,
      targets: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired
        })
      )
    })
  }).isRequired,
  answer: PropTypes.string,
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'checking', 'correct', 'incorrect'])
};

