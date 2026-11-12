/**
 * Welcome Screen
 * Matches stitch_cyberlingo_mobile_app/welcome_to_cyberlingo design.
 * Features floating Shieldy mascot, cyber badges, "Get Started", and "I already have an account".
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import Mascot from '../components/ui/Mascot.jsx';
import AuthModal from '../components/modals/AuthModal.jsx';

export default function Welcome({ onGetStarted, onLoginSuccess }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col items-center justify-between p-4 selection:bg-primary-container selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-[-10%] w-60 h-60 bg-secondary-fixed/25 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main Container */}
      <main className="flex flex-col w-full max-w-[480px] min-h-[92vh] justify-between items-center py-6 px-4">
        {/* Top App Branding */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container shadow-btn-primary-sm flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl font-bold">security</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-black text-on-surface tracking-tight">CyberLingo</span>
            <span className="w-2.5 h-2.5 bg-primary-container rounded-full ml-0.5 inline-block" />
          </div>
        </div>

        {/* Hero Section with Floating Mascot & Tactile Badges */}
        <div className="relative w-full flex flex-col items-center justify-center my-auto py-4">
          {/* Floating Badges */}
          <div className="absolute top-2 left-4 animate-bounce" style={{ animationDuration: '3.2s' }}>
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center shadow-[0_3px_0_0_#88ceff] text-on-secondary-fixed">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
            </div>
          </div>

          <div className="absolute top-6 right-6 animate-bounce" style={{ animationDuration: '2.7s', animationDelay: '0.5s' }}>
            <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center shadow-[0_3px_0_0_#f4bf00] text-on-tertiary-fixed">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                vpn_key
              </span>
            </div>
          </div>

          <div className="absolute bottom-10 left-6 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.2s' }}>
            <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-[0_3px_0_0_#eae8e7] text-secondary">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
          </div>

          <div className="absolute bottom-14 right-6 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.8s' }}>
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shadow-[0_3px_0_0_#6be026] text-on-primary-fixed">
              <span className="material-symbols-outlined text-sm font-bold">bolt</span>
            </div>
          </div>

          {/* Interactive Shieldy Mascot */}
          <div className="relative flex flex-col items-center group cursor-pointer">
            <Mascot state="happy" size={210} />
          </div>

          {/* Value Proposition Copy Block */}
          <div className="text-center mt-6 max-w-sm px-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-snug">
              Learn cybersecurity in 5 minutes a day
            </h1>
            <p className="text-sm font-semibold text-on-surface-variant mt-2 leading-relaxed">
              Hack your habits. Stay one step ahead of the phishers with bite-sized fun missions.
            </p>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="w-full flex flex-col gap-3.5 pb-2">
          <button
            onClick={onGetStarted}
            className="btn-tactile btn-primary w-full py-4 text-base tracking-wider uppercase"
            type="button"
          >
            Get Started
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            className="btn-tactile btn-white w-full py-3.5 text-xs text-primary font-extrabold tracking-wider uppercase"
            type="button"
          >
            I Already Have an Account
          </button>
        </div>
      </main>

      {/* Auth Modal for Existing Users */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={onLoginSuccess}
        />
      )}
    </div>
  );
}

Welcome.propTypes = {
  onGetStarted: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired
};
