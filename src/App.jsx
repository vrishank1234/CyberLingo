import { useState } from 'react';
import Mascot from './components/ui/Mascot.jsx';

export default function App() {
  const [mascotState, setMascotState] = useState('idle');
  const [selectedOption, setSelectedOption] = useState(1);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-[480px] bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-btn-primary-sm text-white">
            <span className="material-symbols-outlined text-2xl">security</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">
            CyberLingo<span className="text-primary-container">.</span>
          </h1>
        </div>

        {/* Mascot Shieldy Display */}
        <div className="flex flex-col items-center my-2">
          <Mascot state={mascotState} size={150} />
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-2">
            Mascot State: <span className="text-primary-container">{mascotState}</span>
          </span>
        </div>

        {/* State Toggle Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {['idle', 'happy', 'cheer', 'sad', 'thinking'].map((state) => (
            <button
              key={state}
              onClick={() => setMascotState(state)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border uppercase transition-all ${
                mascotState === state
                  ? 'bg-primary-container text-white border-primary-shade shadow-btn-primary-sm'
                  : 'bg-white text-on-surface border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Tactile Option Cards Preview */}
        <div className="w-full space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Tactile Option Cards
          </p>
          <div
            onClick={() => setSelectedOption(1)}
            className={`option-card p-3.5 flex items-center justify-between ${
              selectedOption === 1 ? 'option-card-selected' : ''
            }`}
          >
            <span className="font-bold text-sm">A. Confidentiality (Encryption & Access)</span>
            <span className="material-symbols-outlined text-sm font-bold">
              {selectedOption === 1 ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </div>

          <div
            onClick={() => setSelectedOption(2)}
            className={`option-card p-3.5 flex items-center justify-between ${
              selectedOption === 2 ? 'option-card-selected' : ''
            }`}
          >
            <span className="font-bold text-sm">B. Integrity (Hashing & Signatures)</span>
            <span className="material-symbols-outlined text-sm font-bold">
              {selectedOption === 2 ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </div>
        </div>

        {/* 3D Chunky Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button className="btn-tactile btn-primary w-full py-3.5 text-base">
            Continue Mission
          </button>
          <button className="btn-tactile btn-secondary w-full py-3 text-sm">
            Inspect Threat Details
          </button>
        </div>

        {/* Phase Status Banner */}
        <div className="w-full bg-surface-container rounded-xl p-3 text-center border border-outline-variant/30">
          <p className="text-xs font-bold text-primary-shade flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-base">verified</span>
            Phase 0 Scaffolding Ready
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            React 18 • Vite • Tailwind • Firebase Emulators • Content Pipeline
          </p>
        </div>
      </main>
    </div>
  );
}
