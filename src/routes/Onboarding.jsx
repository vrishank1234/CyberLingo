/**
 * Onboarding Flow Component
 * 4-Step Interactive Duolingo-style Onboarding:
 * 1. Goal Selection (career, cert, protect, work, curious)
 * 2. Experience Level (Level 1, Level 2, Level 3 with optional placement test)
 * 3. Daily Goal XP (10, 20, 30, 50 XP)
 * 4. Create Profile / Guest Play (Google, Email, or Play as Guest)
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import Mascot from '../components/ui/Mascot.jsx';
import PlacementQuizModal from '../components/modals/PlacementQuizModal.jsx';
import AuthModal from '../components/modals/AuthModal.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useUserStore } from '../store/userStore.js';

export default function Onboarding({ onComplete, onBackToWelcome }) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('protect');
  const [level, setLevel] = useState(2);
  const [dailyGoalXp, setDailyGoalXp] = useState(20);
  const [showPlacementQuiz, setShowPlacementQuiz] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const { playAsGuest, signInWithGoogle, loading } = useAuth();
  const { setOnboardingData, addXp } = useUserStore();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBackToWelcome();
    }
  };

  const finishOnboarding = (user) => {
    setOnboardingData({ goal, level, dailyGoalXp });
    onComplete(user);
  };

  const handleGuestPlay = async () => {
    const guestUser = await playAsGuest();
    finishOnboarding(guestUser);
  };

  const handleGoogleSignup = async () => {
    try {
      const gUser = await signInWithGoogle();
      finishOnboarding(gUser);
    } catch (err) {
      console.error('Google Sign up failed:', err);
    }
  };

  const handlePlacementResult = (passed) => {
    if (passed) {
      addXp(50);
    }
    setStep(3); // Advance to daily goal
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col items-center justify-between p-4 selection:bg-primary-container selection:text-white">
      <main className="flex flex-col w-full max-w-[480px] min-h-[92vh] pb-24">
        {/* Top Progress Header */}
        <header className="flex items-center justify-between gap-3 pt-2 pb-4 w-full">
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high transition-transform active:scale-95 text-on-surface cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>

          {/* Progress Bar (Step 1=25%, Step 2=50%, Step 3=75%, Step 4=100%) */}
          <div className="flex-1 h-3.5 bg-surface-container-highest rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-primary-container rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Streak Flame Pill */}
          <div className="flex items-center gap-1 px-3 py-1 bg-surface-container-low rounded-full border border-neutral-200/50 shadow-sm">
            <span
              className="material-symbols-outlined text-[#FF9600] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-extrabold text-xs text-on-surface">1</span>
          </div>
        </header>

        {/* ============================================================== */}
        {/* STEP 1: GOAL SELECTION */}
        {/* ============================================================== */}
        {step === 1 && (
          <div className="flex flex-col flex-1">
            {/* Mascot Dialogue Stage */}
            <section className="flex items-center gap-3 my-2">
              <Mascot state="happy" size={76} className="shrink-0" />
              <div className="relative flex-1 bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-surface-container-lowest" />
                <p className="font-extrabold text-base text-on-surface">
                  Why do you want to learn cybersecurity?
                </p>
              </div>
            </section>

            {/* Goals List */}
            <div className="flex flex-col gap-3 mt-4">
              {[
                {
                  id: 'protect',
                  emoji: '🛡️',
                  title: 'Protect myself and my family',
                  subtitle: 'Stop scams, identity theft & data leaks'
                },
                {
                  id: 'career',
                  emoji: '🚀',
                  title: 'Start a career in security',
                  subtitle: 'Become an analyst, pentester, or defender'
                },
                {
                  id: 'cert',
                  emoji: '🎓',
                  title: 'Prepare for a certification',
                  subtitle: 'CompTIA Security+, CEH, CISSP & more'
                },
                {
                  id: 'work',
                  emoji: '💼',
                  title: 'Stay safe at work',
                  subtitle: 'Avoid corporate phishing & social engineering'
                },
                {
                  id: 'curious',
                  emoji: '✨',
                  title: 'Just curious',
                  subtitle: 'Explore how hackers think and defenses work'
                }
              ].map((item) => {
                const isSelected = goal === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setGoal(item.id)}
                    className={`option-card p-3.5 flex items-center justify-between cursor-pointer ${
                      isSelected ? 'option-card-selected' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-container text-2xl shrink-0">
                        {item.emoji}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-sm text-on-surface truncate">
                          {item.title}
                        </span>
                        <span className="text-xs font-semibold text-on-surface-variant truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-secondary text-white' : 'bg-surface-container text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: EXPERIENCE LEVEL */}
        {/* ============================================================== */}
        {step === 2 && (
          <div className="flex flex-col flex-1">
            <section className="flex items-center gap-3 my-2">
              <Mascot state="thinking" size={76} className="shrink-0" />
              <div className="relative flex-1 bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-surface-container-lowest" />
                <p className="font-extrabold text-base text-on-surface">
                  How much do you know about cybersecurity?
                </p>
              </div>
            </section>

            <div className="flex flex-col gap-3 mt-4">
              {[
                {
                  id: 1,
                  bars: 1,
                  title: "I'm brand new to security",
                  subtitle: 'Never worked with code, networks, or hacking terms.'
                },
                {
                  id: 2,
                  bars: 2,
                  title: 'I know the basics',
                  subtitle: 'I understand passwords, MFA, and avoiding suspicious links.'
                },
                {
                  id: 3,
                  bars: 3,
                  title: 'I have IT / security experience',
                  subtitle: 'I know terminal tools, protocols, and want to test ahead.'
                }
              ].map((item) => {
                const isSelected = level === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setLevel(item.id)}
                    className={`option-card p-4 flex items-center justify-between cursor-pointer ${
                      isSelected ? 'option-card-selected' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Signal Strength Bars Icon */}
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-end justify-center gap-1 p-2 shrink-0">
                        <span className={`w-1.5 h-3 rounded-full ${item.bars >= 1 ? 'bg-primary-container' : 'bg-surface-variant'}`} />
                        <span className={`w-1.5 h-5 rounded-full ${item.bars >= 2 ? 'bg-primary-container' : 'bg-surface-variant'}`} />
                        <span className={`w-1.5 h-7 rounded-full ${item.bars >= 3 ? 'bg-primary-container' : 'bg-surface-variant'}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-sm text-on-surface truncate">
                          {item.title}
                        </span>
                        <span className="text-xs font-semibold text-on-surface-variant mt-0.5">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-secondary text-white' : 'bg-surface-container text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optional Placement Diagnostic Button */}
            {level === 3 && (
              <div className="mt-4 p-4 rounded-2xl bg-tertiary-fixed/30 border border-tertiary/20 flex flex-col gap-2">
                <span className="font-extrabold text-xs text-tertiary uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  Fast-Track Diagnostic Available
                </span>
                <p className="text-xs font-semibold text-on-surface-variant">
                  Take a 3-question diagnostic quiz to unlock advanced missions and claim +50 XP bonus.
                </p>
                <button
                  onClick={() => setShowPlacementQuiz(true)}
                  className="btn-tactile btn-gold w-full py-2.5 text-xs font-extrabold uppercase mt-1"
                  type="button"
                >
                  Take Placement Test
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: DAILY XP GOAL */}
        {/* ============================================================== */}
        {step === 3 && (
          <div className="flex flex-col flex-1">
            <section className="flex items-center gap-3 my-2">
              <Mascot state="idle" size={76} className="shrink-0" />
              <div className="relative flex-1 bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-surface-container-lowest" />
                <p className="font-extrabold text-base text-on-surface">
                  What is your daily training goal?
                </p>
                <p className="text-xs font-semibold text-on-surface-variant mt-1">
                  You can change this pace anytime in your settings.
                </p>
              </div>
            </section>

            <div className="flex flex-col gap-3 mt-4">
              {[
                { xp: 10, label: 'Casual', time: '5 min / day', icon: 'coffee' },
                { xp: 20, label: 'Regular', time: '10 min / day', icon: 'bolt', suggested: true },
                { xp: 30, label: 'Serious', time: '15 min / day', icon: 'trending_up' },
                { xp: 50, label: 'Intense', time: '20 min / day', icon: 'local_fire_department' }
              ].map((item) => {
                const isSelected = dailyGoalXp === item.xp;
                return (
                  <div
                    key={item.xp}
                    onClick={() => setDailyGoalXp(item.xp)}
                    className={`option-card p-3.5 flex items-center justify-between cursor-pointer ${
                      isSelected ? 'option-card-selected' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-on-surface leading-tight">
                            {item.label}
                          </span>
                          {item.suggested && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-primary-container text-white uppercase tracking-wider">
                              Suggested
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-on-surface-variant">{item.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant">
                        {item.xp} XP
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-secondary text-white' : 'bg-surface-container text-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: CREATE PROFILE / GUEST PLAY */}
        {/* ============================================================== */}
        {step === 4 && (
          <div className="flex flex-col items-center flex-1 text-center">
            {/* Mascot Celebratory Stage */}
            <div className="relative my-2">
              <Mascot state="cheer" size={140} />
            </div>

            <h1 className="text-2xl font-black text-on-surface tracking-tight mt-2">
              Create your profile to save progress
            </h1>
            <p className="text-xs font-semibold text-on-surface-variant max-w-sm mt-1 mb-6">
              Compete in weekly leagues, protect your daily streak, and sync across all devices.
            </p>

            {/* Auth Buttons */}
            <div className="w-full flex flex-col gap-3">
              {/* Google CTA */}
              <button
                onClick={handleGoogleSignup}
                disabled={loading}
                className="btn-tactile btn-white w-full py-3.5 text-xs flex items-center justify-center gap-3"
                type="button"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="uppercase font-extrabold tracking-wider">Continue with Google</span>
              </button>

              {/* Email Signup CTA */}
              <button
                onClick={() => setShowEmailModal(true)}
                disabled={loading}
                className="btn-tactile btn-secondary w-full py-3.5 text-xs flex items-center justify-center gap-2"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
                <span className="uppercase font-extrabold tracking-wider">Sign up with Email</span>
              </button>

              {/* Anonymous Play / Skip for Now CTA */}
              <button
                onClick={handleGuestPlay}
                disabled={loading}
                className="w-full py-3 text-xs font-extrabold text-on-surface-variant hover:text-on-surface uppercase tracking-wider mt-2 transition-colors cursor-pointer"
                type="button"
              >
                Play as Guest (Skip for now)
              </button>
            </div>
          </div>
        )}

        {/* Pinned Bottom Continue Bar for Steps 1-3 */}
        {step < 4 && (
          <aside className="fixed bottom-0 inset-x-0 max-w-[480px] mx-auto px-4 pb-safe pt-3 bg-surface/95 backdrop-blur-md z-30 border-t border-outline-variant/30">
            <button
              onClick={handleNext}
              className="btn-tactile btn-primary w-full py-4 text-base tracking-wider uppercase flex items-center justify-center gap-2"
              type="button"
            >
              <span>Continue</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </aside>
        )}
      </main>

      {/* Optional Placement Diagnostic Modal */}
      {showPlacementQuiz && (
        <PlacementQuizModal
          isOpen={showPlacementQuiz}
          onClose={() => setShowPlacementQuiz(false)}
          onComplete={handlePlacementResult}
        />
      )}

      {/* Email Registration Modal */}
      {showEmailModal && (
        <AuthModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSuccess={() => finishOnboarding(null)}
        />
      )}
    </div>
  );
}

Onboarding.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBackToWelcome: PropTypes.func.isRequired
};
