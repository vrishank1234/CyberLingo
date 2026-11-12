/**
 * CyberLingo App Root
 * Duolingo-style gamified learning platform for cybersecurity.
 * Phase 1: Authentication, Onboarding, and Learn Path UI.
 */

import { useState } from 'react';
import { useUserStore } from './store/userStore.js';
import Welcome from './routes/Welcome.jsx';
import Onboarding from './routes/Onboarding.jsx';
import Learn from './routes/Learn.jsx';
import PlaceholderTab from './routes/PlaceholderTab.jsx';
import TopBar from './components/layout/TopBar.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

export default function App() {
  const { user, isOnboarded } = useUserStore();
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome' | 'onboarding' | 'main'
  const [activeTab, setActiveTab] = useState('learn'); // 'learn' | 'practice' | 'leaderboard' | 'quests' | 'profile'
  const [lessonPrompt, setLessonPrompt] = useState(null); // Preview banner for selected lesson

  // Determine whether to show onboarding or main app
  const showMainApp = Boolean(user && isOnboarded) || currentView === 'main';

  // Handler when user starts onboarding from Welcome screen
  const handleGetStarted = () => {
    setCurrentView('onboarding');
  };

  // Handler when user completes onboarding (guest or authenticated)
  const handleOnboardingComplete = (_newUser) => {
    setCurrentView('main');
  };

  // Handler when user logs in directly from Welcome screen
  const handleLoginSuccess = () => {
    setCurrentView('main');
  };

  // Handler when a lesson is launched from Learn path
  const handleStartLesson = (lesson, unit) => {
    setLessonPrompt({
      lesson,
      unit,
      message: `Lesson "${lesson.title}" ready to launch! (Phase 2 will run the full interactive exercise player)`
    });
  };

  // If not in main app, render Welcome or Onboarding
  if (!showMainApp) {
    if (currentView === 'onboarding') {
      return (
        <Onboarding
          onComplete={handleOnboardingComplete}
          onBackToWelcome={() => setCurrentView('welcome')}
        />
      );
    }
    return (
      <Welcome
        onGetStarted={handleGetStarted}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Main App View (Mobile 480px column centered, left sidebar on desktop md+)
  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row font-sans text-on-surface antialiased">
      {/* Desktop Left Sidebar (Visible on md+) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setLessonPrompt(null);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Gamification Bar (Streak, Gems, Hearts, Profile) */}
        <TopBar onProfileClick={() => setActiveTab('profile')} />

        {/* Selected Lesson Launch Notice (Phase 1 to Phase 2 Bridge) */}
        {lessonPrompt && (
          <div className="max-w-[480px] mx-auto w-full px-4 pt-3">
            <div className="p-4 rounded-2xl bg-secondary-fixed/30 border-2 border-secondary shadow-md flex items-center justify-between gap-3 animate-[slideUp_0.2s_ease-out]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-secondary">
                  sports_esports
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-on-surface">
                    {lessonPrompt.lesson.title}
                  </h4>
                  <p className="text-xs font-semibold text-secondary">
                    {lessonPrompt.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLessonPrompt(null)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
                type="button"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <main className="flex-1 px-4 py-3 max-w-[480px] md:max-w-[640px] w-full mx-auto">
          {activeTab === 'learn' && (
            <Learn onStartLesson={handleStartLesson} />
          )}

          {activeTab !== 'learn' && (
            <PlaceholderTab
              tabId={activeTab}
              onStartPractice={() => {
                setActiveTab('learn');
                setLessonPrompt({
                  lesson: { title: 'Practice Defense Drill' },
                  message: 'Practice drill selected (+1 Heart upon completion).'
                });
              }}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (Hidden on md+) */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setLessonPrompt(null);
          }}
        />
      </div>
    </div>
  );
}
