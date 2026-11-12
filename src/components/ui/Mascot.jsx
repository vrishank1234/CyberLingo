/**
 * CyberLingo Mascot: Shieldy
 * Original friendly cyber-defense mascot with expressive vector states.
 * States: 'idle', 'happy', 'cheer', 'sad', 'thinking'
 */

import PropTypes from 'prop-types';

export default function Mascot({ state = 'idle', size = 160, className = '' }) {
  const isSad = state === 'sad';
  const isCheer = state === 'cheer' || state === 'celebrate';
  const isThinking = state === 'thinking';

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`CyberLingo Mascot Shieldy (${state})`}
    >
      <svg
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
        className={`w-full h-full drop-shadow-md transition-transform duration-300 ${
          isCheer ? 'animate-bounce' : ''
        }`}
      >
        <defs>
          <linearGradient id="shieldGradMain" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={isSad ? '#64748b' : '#6ee612'} />
            <stop offset="100%" stopColor={isSad ? '#334155' : '#46a800'} />
          </linearGradient>
          <linearGradient id="faceGradMain" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#1f272b" />
            <stop offset="100%" stopColor="#11171a" />
          </linearGradient>
          <radialGradient id="cheerAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#58cc02" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Celebration Aura */}
        {isCheer && (
          <circle cx="256" cy="240" r="210" fill="url(#cheerAura)" opacity="0.6" />
        )}

        {/* Ears / Side Nodes */}
        <circle
          cx="90"
          cy={isSad ? 260 : 245}
          r="30"
          fill={isSad ? '#475569' : '#52bc02'}
        />
        <circle
          cx="422"
          cy={isCheer ? 165 : 190}
          r="34"
          fill={isSad ? '#475569' : '#52bc02'}
        />
        <circle
          cx="422"
          cy={isCheer ? 165 : 190}
          r="14"
          fill={isSad ? '#94a3b8' : '#6ee612'}
        />

        {/* Antenna */}
        <path
          d={isSad ? 'M256 65 L245 42' : 'M256 65 L256 30'}
          stroke="#0096e6"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <circle
          cx={isSad ? 245 : 256}
          cy={isSad ? 38 : 22}
          r="18"
          fill={isSad ? '#ff4b4b' : '#0096e6'}
        />
        <circle
          cx={isSad ? 245 : 256}
          cy={isSad ? 38 : 22}
          r="7"
          fill={isSad ? '#ffffff' : '#6be026'}
        />

        {/* Outer Shield Body */}
        <path
          d="M256 60 C370 60 435 120 435 240 C435 340 330 420 256 450 C182 420 77 340 77 240 C77 120 142 60 256 60 Z"
          fill="url(#shieldGradMain)"
        />

        {/* Inner Visor Face */}
        <path
          d="M256 115 C336 115 382 155 382 245 C382 315 310 375 256 395 C202 375 130 315 130 245 C130 155 176 115 256 115 Z"
          fill="url(#faceGradMain)"
        />

        {/* Eyes */}
        {isSad ? (
          // Sad/drooped eyes with tears
          <g id="sad-eyes">
            <path
              d="M185 235 Q210 215 235 235"
              stroke="#00bfff"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M277 235 Q302 215 327 235"
              stroke="#00bfff"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            {/* Tear drops */}
            <circle cx="195" cy="255" r="7" fill="#38bdf8" />
            <circle cx="317" cy="255" r="7" fill="#38bdf8" />
          </g>
        ) : isThinking ? (
          // Thinking glance eyes
          <g id="thinking-eyes">
            <ellipse cx="220" cy="215" rx="28" ry="34" fill="#00bfff" />
            <circle cx="215" cy="198" r="10" fill="#ffffff" />
            <ellipse cx="312" cy="215" rx="28" ry="34" fill="#00bfff" />
            <circle cx="307" cy="198" r="10" fill="#ffffff" />
          </g>
        ) : (
          // Bright happy / cheer / idle anime glow eyes
          <g id="normal-eyes">
            <ellipse cx="210" cy="225" rx="30" ry="38" fill="#00bfff" />
            <circle cx="200" cy="205" r="12" fill="#ffffff" />
            <circle cx="222" cy="235" r="6" fill="#ffffff" />

            <ellipse cx="302" cy="225" rx="30" ry="38" fill="#00bfff" />
            <circle cx="292" cy="205" r="12" fill="#ffffff" />
            <circle cx="314" cy="235" r="6" fill="#ffffff" />
          </g>
        )}

        {/* Blush Cheeks */}
        {!isSad && (
          <g id="cheeks">
            <ellipse cx="178" cy="248" rx="16" ry="10" fill="#f87171" opacity="0.8" />
            <ellipse cx="334" cy="248" rx="16" ry="10" fill="#f87171" opacity="0.8" />
          </g>
        )}

        {/* Mouth */}
        {isSad ? (
          <path
            d="M236 295 Q256 275 276 295"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        ) : isCheer ? (
          // Big joyful open mouth
          <path
            d="M228 262 Q256 305 284 262 Z"
            fill="#ff4b4b"
            stroke="#ffffff"
            strokeWidth="5"
          />
        ) : (
          // Friendly gentle smile
          <path
            d="M232 268 Q256 288 280 268"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
          />
        )}
      </svg>
      {/* Ground Shadow */}
      <div className="w-2/3 h-2.5 bg-surface-dim rounded-full mt-1 blur-[1px] opacity-70" />
    </div>
  );
}

Mascot.propTypes = {
  state: PropTypes.oneOf(['idle', 'happy', 'cheer', 'celebrate', 'sad', 'thinking']),
  size: PropTypes.number,
  className: PropTypes.string
};

