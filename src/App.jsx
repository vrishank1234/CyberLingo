/**
 * CyberLingo App Root
 * Duolingo-style gamified learning platform for cybersecurity.
 * Integrates Welcome, Onboarding, Learn Path, and Full Lesson Player.
 */

import { useState } from 'react';
import { useUserStore } from './store/userStore.js';
import { useLessonStore } from './store/lessonStore.js';
import Welcome from './routes/Welcome.jsx';
import Onboarding from './routes/Onboarding.jsx';
import Learn from './routes/Learn.jsx';
import PlaceholderTab from './routes/PlaceholderTab.jsx';
import LessonPlayer from './components/lesson/LessonPlayer.jsx';
import TopBar from './components/layout/TopBar.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

export default function App() {
  const { user, isOnboarded } = useUserStore();
  const { initLesson } = useLessonStore();

  const [currentView, setCurrentView] = useState('welcome'); // 'welcome' | 'onboarding' | 'main'
  const [activeTab, setActiveTab] = useState('learn'); // 'learn' | 'practice' | 'leaderboard' | 'quests' | 'profile'
  const [activeLessonSession, setActiveLessonSession] = useState(null); // When set, renders full-screen LessonPlayer

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

  // Handler to launch full-screen lesson player
  const handleStartLesson = (lesson, unit) => {
    initLesson(lesson, unit, lesson.exercises || []);
    setActiveLessonSession({ lesson, unit });
  };

  // Render full-screen Lesson Player when active
  if (activeLessonSession) {
    return (
      <LessonPlayer
        onExitLesson={() => setActiveLessonSession(null)}
      />
    );
  }

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
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Gamification Bar (Streak, Gems, Hearts, Profile) */}
        <TopBar onProfileClick={() => setActiveTab('profile')} />

        {/* Tab Content */}
        <main className="flex-1 px-4 py-3 max-w-[480px] md:max-w-[640px] w-full mx-auto">
          {activeTab === 'learn' && (
            <Learn onStartLesson={handleStartLesson} />
          )}

          {activeTab !== 'learn' && (
            <PlaceholderTab
              tabId={activeTab}
              onStartPractice={() => {
                // Quick practice session
                handleStartLesson(
                  {
                    lessonId: 'practice-01',
                    title: 'Defense Drill Practice',
                    exercises: [
                      {
                        id: 'p1',
                        type: 'multiple_choice',
                        prompt: 'Which protocol encrypts web traffic?',
                        options: ['HTTP', 'HTTPS', 'FTP', 'Telnet'],
                        answer: 1,
                        explanation: 'HTTPS uses TLS to encrypt browser communications.'
                      },
                      {
                        id: 'p2',
                        type: 'true_false',
                        prompt: 'MFA provides stronger authentication than single passwords.',
                        answer: true,
                        explanation: 'MFA requires two or more verification factors.'
                      }
                    ]
                  },
                  { title: 'Practice Defense Drill', color: '#58CC02' }
                );
              }}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (Hidden on md+) */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      </div>
    </div>
  );
}
